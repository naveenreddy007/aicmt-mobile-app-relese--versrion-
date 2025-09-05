"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addQuotationHistory(custom_order_id: string, quotation_id: string, status: string, notes?: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("quotation_history")
    .insert([{ custom_order_id, quotation_id, status, notes }])
    .select();

  if (error) {
    console.error("Error adding quotation history:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/custom-orders/${custom_order_id}`);

  return { success: true, data };
}