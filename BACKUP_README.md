# Supabase Backup & Restore System

This project includes a comprehensive backup and restore system for your Supabase database. The system allows you to:

- **Backup all tables** to local JSON files with timestamps
- **Restore data** from backup files back to Supabase
- **View backup summaries** and manage multiple backup versions
- **Include metadata** and schema information with each backup

## 🚀 Quick Start

### Create a Backup

```bash
pnpm run backup
```

This will:
- Connect to your Supabase database
- Export all 21 tables to individual JSON files
- Create a timestamped backup directory in `./backups/`
- Generate a summary report with backup statistics

### List Available Backups

```bash
pnpm run backup:list
```

Shows all available backup directories with table and record counts.

### Restore from Backup

```bash
# Restore without clearing existing data (adds to existing data)
pnpm run restore backups/backup-2025-08-11T07-28-47

# Restore and clear existing data first (complete replacement)
pnpm run restore backups/backup-2025-08-11T07-28-47 --clear
```

⚠️ **Warning**: Using `--clear` will delete all existing data in the tables before restoring!

## 📁 Backup Structure

Each backup creates a timestamped directory containing:

```
backups/
└── backup-2025-08-11T07-28-47/
    ├── analytics.json
    ├── backups.json
    ├── blog_categories.json
    ├── blog_comments.json
    ├── blog_post_likes.json
    ├── blog_post_tags.json
    ├── blog_posts.json
    ├── blog_tags.json
    ├── custom_orders.json
    ├── inquiries.json
    ├── media.json
    ├── permissions.json
    ├── product_images.json
    ├── products.json
    ├── profiles.json
    ├── review_images.json
    ├── review_responses.json
    ├── reviews.json
    ├── role_permissions.json
    ├── roles.json
    ├── seo_metadata.json
    └── backup-summary.json
```

## 📄 File Format

Each table backup file contains:

```json
{
  "metadata": {
    "table": "products",
    "timestamp": "2025-08-11T07-28-47",
    "recordCount": 16,
    "backupDate": "2025-08-11T07:28:57.851Z",
    "schema": null
  },
  "data": [
    {
      "id": "bfc3dd64-c744-4c6f-9ec6-4d089d74b609",
      "name": "Biodegradable Shopping Bags",
      "code": "BSB-001",
      // ... rest of the record data
    }
  ]
}
```

## 🔧 Configuration

The backup system uses your existing Supabase configuration:

- **URL**: `https://ylqpagsrjmoelausmtku.supabase.co`
- **Service Role Key**: Configured in the scripts (uses elevated permissions for full data access)

## 📊 Tables Included

The system backs up all 21 tables:

1. `analytics` (14 records)
2. `backups` (0 records)
3. `blog_categories` (0 records)
4. `blog_comments` (0 records)
5. `blog_post_likes` (0 records)
6. `blog_post_tags` (4 records)
7. `blog_posts` (1 record)
8. `blog_tags` (0 records)
9. `custom_orders` (4 records)
10. `inquiries` (2 records)
11. `media` (0 records)
12. `permissions` (19 records)
13. `product_images` (9 records)
14. `products` (16 records)
15. `profiles` (1 record)
16. `review_images` (0 records)
17. `review_responses` (0 records)
18. `reviews` (2 records)
19. `role_permissions` (38 records)
20. `roles` (3 records)
21. `seo_metadata` (0 records)

**Total**: 113 records across all tables

## ⚡ Features

### Backup Features
- ✅ **Complete data export** - All tables and records
- ✅ **Timestamped backups** - Organized by date/time
- ✅ **Progress logging** - Real-time backup status
- ✅ **Error handling** - Continues on individual table failures
- ✅ **Summary reports** - Detailed backup statistics
- ✅ **Metadata inclusion** - Table schema and backup info

### Restore Features
- ✅ **Selective restore** - Choose specific backup to restore
- ✅ **Safe mode** - Add to existing data (default)
- ✅ **Clear mode** - Replace all existing data
- ✅ **Batch processing** - Handles large datasets efficiently
- ✅ **Confirmation prompts** - Prevents accidental data loss
- ✅ **Progress tracking** - Real-time restore status

## 🛡️ Safety Features

1. **Confirmation prompts** when using `--clear` mode
2. **Batch processing** to prevent timeouts on large datasets
3. **Error recovery** - Continues processing other tables if one fails
4. **Detailed logging** for troubleshooting
5. **Non-destructive by default** - Adds to existing data unless `--clear` is specified

## 🔍 Troubleshooting

### Common Issues

**Permission Errors**
- Ensure your Supabase service role key has the necessary permissions
- Check that RLS (Row Level Security) policies allow service role access

**Large Dataset Timeouts**
- The system uses batch processing (100 records per batch) to prevent timeouts
- For very large tables, consider backing up during low-traffic periods

**Schema Retrieval Warnings**
- Schema information may not be available due to Supabase permissions
- This doesn't affect data backup/restore functionality

### Getting Help

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify your Supabase connection and permissions
3. Ensure all dependencies are installed (`pnpm install`)

## 📝 Example Usage

```bash
# 1. Create a backup
pnpm run backup
# Output: Backup created in backups/backup-2025-08-11T07-28-47/

# 2. List available backups
pnpm run backup:list
# Output: Shows all backup directories with statistics

# 3. Restore from backup (safe mode - adds to existing data)
pnpm run restore backups/backup-2025-08-11T07-28-47

# 4. Restore from backup (clear mode - replaces all data)
pnpm run restore backups/backup-2025-08-11T07-28-47 --clear
```

---

---

**Start from here** - Safe backup point created on 2025-09-05
**Note**: Always test restore operations in a development environment before using in production!