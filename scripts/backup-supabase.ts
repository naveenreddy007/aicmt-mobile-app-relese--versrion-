#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Supabase configuration from the project
const SUPABASE_URL = 'https://ylqpagsrjmoelausmtku.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscXBhZ3Nyam1vZWxhdXNtdGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMyMjc2MSwiZXhwIjoyMDYyODk4NzYxfQ.M7Wj2_gEGipgGEkFlthOjU4gZoa4EGt1BO2IAYBc5HQ'

// List of all tables to backup
const TABLES = [
  'achievements',
  'analytics',
  'backups',
  'blog_categories',
  'blog_comments',
  'blog_post_likes',
  'blog_post_tags',
  'blog_posts',
  'blog_tags',
  'cart_items',
  'certifications',
  'custom_orders',
  'events',
  'factory_tours',
  'gallery',
  'impact_stories',
  'inquiries',
  'journey_milestones',
  'media',
  'media_library',
  'order_items',
  'orders',
  'payments',
  'permissions',
  'product_images',
  'product_marketplace_links',
  'products',
  'products_with_marketplace_links',
  'profiles',
  'quotation_history',
  'quotations',
  'review_images',
  'review_responses',
  'reviews',
  'role_permissions',
  'roles',
  'seo_metadata',
  'team_members'
]

interface BackupResult {
  table: string
  success: boolean
  recordCount: number
  error?: string
  filePath?: string
}

interface TableSchema {
  table_name: string
  columns: Array<{
    column_name: string
    data_type: string
    is_nullable: string
    column_default: string | null
  }>
}

class SupabaseBackup {
  private supabase
  private backupDir: string
  private timestamp: string

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    this.backupDir = path.join(process.cwd(), 'backups', `backup-${this.timestamp}`)
    
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  private log(message: string, type: 'info' | 'error' | 'success' = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'
    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  private async getTableSchema(tableName: string): Promise<TableSchema | null> {
    try {
      // Use raw SQL query to get table schema from information_schema
      const { data, error } = await this.supabase.rpc('get_table_schema', {
        table_name_param: tableName
      })

      if (error) {
        // If RPC function doesn't exist, try direct SQL query
        const { data: sqlData, error: sqlError } = await this.supabase
          .from('pg_catalog.pg_tables')
          .select('*')
          .eq('tablename', tableName)
          .eq('schemaname', 'public')
          .limit(1)

        if (sqlError) {
          this.log(`Failed to get schema for table ${tableName}: ${sqlError.message}`, 'error')
          return {
            table_name: tableName,
            columns: []
          }
        }

        return {
          table_name: tableName,
          columns: []
        }
      }

      return {
        table_name: tableName,
        columns: data || []
      }
    } catch (error) {
      this.log(`Error getting schema for table ${tableName}: ${error}`, 'error')
      return {
        table_name: tableName,
        columns: []
      }
    }
  }

  private async backupTable(tableName: string): Promise<BackupResult> {
    try {
      this.log(`Starting backup for table: ${tableName}`)
      
      // Get table schema
      const schema = await this.getTableSchema(tableName)
      
      // Get all data from the table
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')

      if (error) {
        return {
          table: tableName,
          success: false,
          recordCount: 0,
          error: error.message
        }
      }

      const recordCount = data?.length || 0
      
      // Create backup object
      const backupData = {
        metadata: {
          table: tableName,
          timestamp: this.timestamp,
          recordCount,
          backupDate: new Date().toISOString(),
          schema: schema
        },
        data: data || []
      }

      // Write to JSON file
      const fileName = `${tableName}.json`
      const filePath = path.join(this.backupDir, fileName)
      
      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8')
      
      this.log(`✅ Backed up ${recordCount} records from ${tableName}`, 'success')
      
      return {
        table: tableName,
        success: true,
        recordCount,
        filePath
      }
    } catch (error) {
      return {
        table: tableName,
        success: false,
        recordCount: 0,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async backupAllTables(): Promise<BackupResult[]> {
    this.log(`Starting backup process for ${TABLES.length} tables...`)
    this.log(`Backup directory: ${this.backupDir}`)
    
    const results: BackupResult[] = []
    
    for (const table of TABLES) {
      const result = await this.backupTable(table)
      results.push(result)
      
      if (!result.success) {
        this.log(`Failed to backup ${table}: ${result.error}`, 'error')
      }
    }
    
    // Create summary report
    const summary = {
      timestamp: this.timestamp,
      totalTables: TABLES.length,
      successfulBackups: results.filter(r => r.success).length,
      failedBackups: results.filter(r => !r.success).length,
      totalRecords: results.reduce((sum, r) => sum + r.recordCount, 0),
      results
    }
    
    // Write summary to file
    const summaryPath = path.join(this.backupDir, 'backup-summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8')
    
    this.log(`\n📊 Backup Summary:`, 'info')
    this.log(`   Total tables: ${summary.totalTables}`)
    this.log(`   Successful: ${summary.successfulBackups}`)
    this.log(`   Failed: ${summary.failedBackups}`)
    this.log(`   Total records: ${summary.totalRecords}`)
    this.log(`   Backup location: ${this.backupDir}`)
    
    if (summary.failedBackups > 0) {
      this.log(`\n❌ Failed backups:`, 'error')
      results.filter(r => !r.success).forEach(r => {
        this.log(`   - ${r.table}: ${r.error}`, 'error')
      })
    }
    
    return results
  }
}

// Main execution
async function main() {
  try {
    const backup = new SupabaseBackup()
    await backup.backupAllTables()
    process.exit(0)
  } catch (error) {
    console.error('❌ Backup process failed:', error)
    process.exit(1)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main()
}

export { SupabaseBackup }