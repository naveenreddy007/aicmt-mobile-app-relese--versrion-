#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// Supabase configuration
const SUPABASE_URL = 'https://ylqpagsrjmoelausmtku.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscXBhZ3Nyam1vZWxhdXNtdGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMyMjc2MSwiZXhwIjoyMDYyODk4NzYxfQ.M7Wj2_gEGipgGEkFlthOjU4gZoa4EGt1BO2IAYBc5HQ'

interface RestoreResult {
  table: string
  success: boolean
  recordsRestored: number
  error?: string
}

interface BackupData {
  metadata: {
    table: string
    timestamp: string
    recordCount: number
    backupDate: string
    schema?: any
  }
  data: any[]
}

class SupabaseRestore {
  private supabase
  private backupDir: string

  constructor(backupDir: string) {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    this.backupDir = backupDir
  }

  private log(message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  private async confirmAction(message: string): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    return new Promise((resolve) => {
      rl.question(`${message} (y/N): `, (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
      })
    })
  }

  private async getBackupFiles(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.backupDir)
      return files.filter(file => file.endsWith('.json') && file !== 'backup-summary.json')
    } catch (error) {
      throw new Error(`Failed to read backup directory: ${error}`)
    }
  }

  private async loadBackupData(fileName: string): Promise<BackupData | null> {
    try {
      const filePath = path.join(this.backupDir, fileName)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContent) as BackupData
    } catch (error) {
      this.log(`Failed to load backup file ${fileName}: ${error}`, 'error')
      return null
    }
  }

  private async clearTable(tableName: string): Promise<boolean> {
    try {
      this.log(`Clearing existing data from table: ${tableName}`)
      
      // Delete all records from the table
      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .neq('id', 0) // This will match all records since id is never 0

      if (error) {
        this.log(`Failed to clear table ${tableName}: ${error.message}`, 'error')
        return false
      }

      return true
    } catch (error) {
      this.log(`Error clearing table ${tableName}: ${error}`, 'error')
      return false
    }
  }

  private async restoreTable(backupData: BackupData, clearFirst: boolean = false): Promise<RestoreResult> {
    const tableName = backupData.metadata.table
    
    try {
      this.log(`Starting restore for table: ${tableName}`)
      this.log(`Records to restore: ${backupData.data.length}`)
      
      // Clear table if requested
      if (clearFirst) {
        const cleared = await this.clearTable(tableName)
        if (!cleared) {
          return {
            table: tableName,
            success: false,
            recordsRestored: 0,
            error: 'Failed to clear existing data'
          }
        }
      }

      // If no data to restore, return success
      if (backupData.data.length === 0) {
        this.log(`No data to restore for table: ${tableName}`, 'warning')
        return {
          table: tableName,
          success: true,
          recordsRestored: 0
        }
      }

      // Insert data in batches to avoid timeout
      const batchSize = 100
      let totalRestored = 0
      
      for (let i = 0; i < backupData.data.length; i += batchSize) {
        const batch = backupData.data.slice(i, i + batchSize)
        
        const { error } = await this.supabase
          .from(tableName)
          .insert(batch)

        if (error) {
          this.log(`Failed to insert batch ${Math.floor(i / batchSize) + 1} for table ${tableName}: ${error.message}`, 'error')
          return {
            table: tableName,
            success: false,
            recordsRestored: totalRestored,
            error: error.message
          }
        }

        totalRestored += batch.length
        this.log(`Restored ${totalRestored}/${backupData.data.length} records for ${tableName}`)
      }

      this.log(`✅ Successfully restored ${totalRestored} records to ${tableName}`, 'success')
      
      return {
        table: tableName,
        success: true,
        recordsRestored: totalRestored
      }
    } catch (error) {
      return {
        table: tableName,
        success: false,
        recordsRestored: 0,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async restoreFromBackup(clearTables: boolean = false): Promise<RestoreResult[]> {
    this.log(`Starting restore process from: ${this.backupDir}`)
    
    // Verify backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      throw new Error(`Backup directory does not exist: ${this.backupDir}`)
    }

    // Get backup files
    const backupFiles = await this.getBackupFiles()
    
    if (backupFiles.length === 0) {
      throw new Error('No backup files found in the specified directory')
    }

    this.log(`Found ${backupFiles.length} backup files`)
    
    // Show warning about data overwrite
    if (clearTables) {
      this.log('⚠️  WARNING: This will clear all existing data in the tables before restoring!', 'warning')
      const confirmed = await this.confirmAction('Are you sure you want to proceed?')
      if (!confirmed) {
        this.log('Restore cancelled by user')
        return []
      }
    }

    const results: RestoreResult[] = []
    
    for (const fileName of backupFiles) {
      const backupData = await this.loadBackupData(fileName)
      
      if (!backupData) {
        results.push({
          table: fileName.replace('.json', ''),
          success: false,
          recordsRestored: 0,
          error: 'Failed to load backup data'
        })
        continue
      }

      const result = await this.restoreTable(backupData, clearTables)
      results.push(result)
    }
    
    // Create restore summary
    const summary = {
      timestamp: new Date().toISOString(),
      backupDir: this.backupDir,
      totalTables: results.length,
      successfulRestores: results.filter(r => r.success).length,
      failedRestores: results.filter(r => !r.success).length,
      totalRecordsRestored: results.reduce((sum, r) => sum + r.recordsRestored, 0),
      results
    }
    
    this.log(`\n📊 Restore Summary:`, 'info')
    this.log(`   Total tables: ${summary.totalTables}`)
    this.log(`   Successful: ${summary.successfulRestores}`)
    this.log(`   Failed: ${summary.failedRestores}`)
    this.log(`   Total records restored: ${summary.totalRecordsRestored}`)
    
    if (summary.failedRestores > 0) {
      this.log(`\n❌ Failed restores:`, 'error')
      results.filter(r => !r.success).forEach(r => {
        this.log(`   - ${r.table}: ${r.error}`, 'error')
      })
    }
    
    return results
  }

  async listAvailableBackups(): Promise<void> {
    const backupsDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupsDir)) {
      this.log('No backups directory found', 'warning')
      return
    }

    const backupDirs = fs.readdirSync(backupsDir)
      .filter(item => {
        const itemPath = path.join(backupsDir, item)
        return fs.statSync(itemPath).isDirectory() && item.startsWith('backup-')
      })
      .sort()
      .reverse() // Most recent first

    if (backupDirs.length === 0) {
      this.log('No backup directories found', 'warning')
      return
    }

    this.log('\n📁 Available backups:')
    backupDirs.forEach((dir, index) => {
      const summaryPath = path.join(backupsDir, dir, 'backup-summary.json')
      let info = ''
      
      if (fs.existsSync(summaryPath)) {
        try {
          const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
          info = ` (${summary.totalTables} tables, ${summary.totalRecords} records)`
        } catch (error) {
          info = ' (summary unavailable)'
        }
      }
      
      this.log(`   ${index + 1}. ${dir}${info}`)
    })
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Supabase Restore Tool

Usage:
  npm run restore <backup-directory> [--clear]
  npm run restore --list

Options:
  --clear    Clear existing data before restoring
  --list     List available backups
  --help     Show this help message

Examples:
  npm run restore backups/backup-2024-01-15T10-30-00
  npm run restore backups/backup-2024-01-15T10-30-00 --clear
  npm run restore --list
`)
    return
  }

  try {
    if (args[0] === '--list') {
      const restore = new SupabaseRestore('')
      await restore.listAvailableBackups()
      return
    }

    const backupDir = args[0]
    const clearTables = args.includes('--clear')
    
    const restore = new SupabaseRestore(backupDir)
    await restore.restoreFromBackup(clearTables)
    
  } catch (error) {
    console.error('❌ Restore process failed:', error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main()
}

export { SupabaseRestore }