# Supabase Backend Schema Completion Status

This document outlines the tables and fields defined in your Supabase backend schema.
A checkmark (✅) indicates that the table and its fields are defined in `database.types.ts`, meaning their structure is complete.

---

## ✅ `products` Table
*Client-side helpers exist in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `name: string`
- ✅ `code: string`
- ✅ `category: string`
- ✅ `description: string | null`
- ✅ `features: Json | null`
- ✅ `specifications: Json | null`
- ✅ `price: string | null`
- ✅ `image_url: string | null`
- ✅ `is_active: boolean`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `product_images` Table
*Client-side helpers for storage (upload/delete/getURL) likely manage these images, though direct table helpers are not in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `product_id: string`
- ✅ `image_url: string`
- ✅ `alt_text: string | null`
- ✅ `is_primary: boolean`
- ✅ `display_order: number`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `blog_posts` Table
*Client-side helpers exist in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `title: string`
- ✅ `slug: string`
- ✅ `content: string | null`
- ✅ `excerpt: string | null`
- ✅ `author_id: string | null` (references `profiles.id`)
- ✅ `category: string | null`
- ✅ `tags: string[] | null`
- ✅ `status: string`
- ✅ `featured_image: string | null`
- ✅ `seo_title: string | null`
- ✅ `seo_description: string | null`
- ✅ `seo_keywords: string | null`
- ✅ `publish_date: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `inquiries` Table
*Client-side helpers exist in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `name: string`
- ✅ `email: string`
- ✅ `company: string | null`
- ✅ `phone: string | null`
- ✅ `message: string`
- ✅ `product_interest: string | null`
- ✅ `status: string`
- ✅ `priority: string`
- ✅ `assigned_to: string | null` (references `profiles.id`)
- ✅ `notes: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `profiles` Table (Users)
*Client-side helpers exist in `lib/supabase.ts`.*
- ✅ `id: string` (typically references `auth.users.id`)
- ✅ `first_name: string | null`
- ✅ `last_name: string | null`
- ✅ `avatar_url: string | null`
- ✅ `company: string | null`
- ✅ `position: string | null`
- ✅ `phone: string | null`
- ✅ `bio: string | null`
- ✅ `role: string` (should reference `roles.id` or be a defined enum)
- ✅ `preferences: Json`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `media` Table
*Client-side storage helpers in `lib/supabase.ts` manage file uploads/deletions; this table likely stores metadata about those files.*
- ✅ `id: string`
- ✅ `file_name: string`
- ✅ `file_path: string`
- ✅ `file_type: string`
- ✅ `file_size: number`
- ✅ `mime_type: string | null`
- ✅ `dimensions: string | null`
- ✅ `alt_text: string | null`
- ✅ `caption: string | null`
- ✅ `uploaded_by: string | null` (references `profiles.id`)
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `seo_metadata` Table
*No direct client-side helpers in `lib/supabase.ts`, likely managed via admin or server-side logic.*
- ✅ `id: string`
- ✅ `page_path: string`
- ✅ `title: string`
- ✅ `description: string | null`
- ✅ `keywords: string | null`
- ✅ `og_title: string | null`
- ✅ `og_description: string | null`
- ✅ `og_image: string | null`
- ✅ `canonical_url: string | null`
- ✅ `robots: string`
- ✅ `structured_data: Json | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `roles` Table
*No direct client-side helpers in `lib/supabase.ts`, fundamental for RBAC.*
- ✅ `id: string`
- ✅ `name: string`
- ✅ `description: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `permissions` Table
*No direct client-side helpers in `lib/supabase.ts`, fundamental for RBAC.*
- ✅ `id: string`
- ✅ `name: string`
- ✅ `description: string | null`
- ✅ `resource: string`
- ✅ `action: string`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `role_permissions` Table (Join Table)
*No direct client-side helpers in `lib/supabase.ts`, fundamental for RBAC.*
- ✅ `role_id: string` (references `roles.id`)
- ✅ `permission_id: string` (references `permissions.id`)
- ✅ `created_at: string`

---

## ✅ `backups` Table
*No direct client-side helpers in `lib/supabase.ts`, likely managed by automated processes or admin tools.*
- ✅ `id: string`
- ✅ `filename: string`
- ✅ `size: number`
- ✅ `backup_type: string`
- ✅ `status: string`
- ✅ `storage_path: string`
- ✅ `created_by: string | null` (references `profiles.id`)
- ✅ `notes: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `custom_orders` Table
*No direct client-side helpers in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `product_type: string`
- ✅ `size: string`
- ✅ `color: string`
- ✅ `thickness: string`
- ✅ `printing: boolean`
- ✅ `printing_colors: number | null`
- ✅ `logo_url: string | null`
- ✅ `quantity: number`
- ✅ `company_name: string`
- ✅ `contact_name: string`
- ✅ `email: string`
- ✅ `phone: string | null`
- ✅ `timeline: string | null`
- ✅ `special_requirements: string | null`
- ✅ `status: string`
- ✅ `quote_amount: number | null`
- ✅ `quote_date: string | null`
- ✅ `notes: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `reviews` Table
*No direct client-side helpers in `lib/supabase.ts` for creating/managing reviews, but product pages might display them.*
- ✅ `id: string`
- ✅ `product_id: string` (references `products.id`)
- ✅ `user_id: string | null` (references `profiles.id`)
- ✅ `name: string`
- ✅ `email: string`
- ✅ `rating: number`
- ✅ `title: string`
- ✅ `content: string`
- ✅ `status: string`
- ✅ `is_verified_purchase: boolean`
- ✅ `helpful_count: number`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `review_images` Table
*No direct client-side helpers in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `review_id: string` (references `reviews.id`)
- ✅ `image_url: string`
- ✅ `created_at: string`

---

## ✅ `review_responses` Table
*No direct client-side helpers in `lib/supabase.ts`.*
- ✅ `id: string`
- ✅ `review_id: string` (references `reviews.id`)
- ✅ `admin_id: string | null` (references `profiles.id`)
- ✅ `content: string`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---

## ✅ `newsletter_subscriptions` Table
*No direct client-side helpers in `lib/supabase.ts`, but likely has server actions or dedicated API routes.*
- ✅ `id: string`
- ✅ `email: string`
- ✅ `is_subscribed: boolean`
- ✅ `subscribed_at: string`
- ✅ `unsubscribed_at: string | null`
- ✅ `source: string | null`
- ✅ `created_at: string`
- ✅ `updated_at: string`

---
This `backend-todo.md` file now reflects the defined state of your Supabase database schema.
