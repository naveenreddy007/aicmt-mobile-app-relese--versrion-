import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { NewsletterSubscriptionsTable } from "@/components/admin/newsletter-subscriptions-table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminNewsletterPage() {
  const supabase = await createSupabaseServerClient()
  const { data: subscriptions, error } = await supabase
    .from("newsletter_subscriptions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching newsletter subscriptions:", error)
    // Handle error display appropriately
  }

  // TODO: Implement CSV export functionality
  // For now, this is a placeholder link/button
  const exportAction = async () => {
    "use server"
    // This would ideally trigger a download or return a CSV string
    // For simplicity, we're not implementing the full CSV generation here
    console.log("Exporting CSV...")
    // In a real scenario, you'd fetch data and format it as CSV.
    // const { data } = await supabase.from('newsletter_subscriptions').select('email,subscribed_at,is_subscribed,source');
    // const csvData = convertToCsv(data); // You'd need a CSV conversion utility
    // return csvData;
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Newsletter Subscriptions" description="Manage your newsletter subscribers.">
        <form action={exportAction}>
          <Button variant="outline" disabled>
            {" "}
            {/* Disabled until fully implemented */}
            <Download className="mr-2 h-4 w-4" />
            Export CSV (Coming Soon)
          </Button>
        </form>
      </AdminHeader>

      {error && <p className="text-red-500">Failed to load subscriptions: {error.message}</p>}

      <NewsletterSubscriptionsTable subscriptions={subscriptions || []} />
    </div>
  )
}
