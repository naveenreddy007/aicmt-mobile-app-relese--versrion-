"use server"

import { Resend } from "resend"
import { addQuotationHistory } from "./quotation-history"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(customerEmail: string, orderDetails: any) {
  try {
    const orderItems = orderDetails.items || []
    const itemsHtml = orderItems.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name || 'Product'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: #1f2937;">Order Details</h2>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Order ID:</strong> #${orderDetails.id.slice(-8).toUpperCase()}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Order Date:</strong> ${new Date(orderDetails.created_at).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Status:</strong> ${orderDetails.status}</p>
          </div>
          
          <h3 style="color: #1f2937; margin-bottom: 15px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 30px;">
            <p style="font-size: 18px; font-weight: bold; color: #1f2937; margin: 0;">Total: $${orderDetails.total_amount.toFixed(2)}</p>
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #065f46; margin: 0 0 10px 0;">What's Next?</h3>
            <p style="color: #047857; margin: 5px 0;">• We'll process your order within 1-2 business days</p>
            <p style="color: #047857; margin: 5px 0;">• You'll receive a shipping confirmation with tracking details</p>
            <p style="color: #047857; margin: 5px 0;">• Track your order anytime in your account dashboard</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderDetails.id}" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">View Order Details</a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Contact us at support@yourcompany.com</p>
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: "Your Company <orders@yourcompany.com>",
      to: customerEmail,
      subject: `Order Confirmation - #${orderDetails.id.slice(-8).toUpperCase()}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error: "Failed to send order confirmation email." }
  }
}

export async function sendQuotationReminder(customerEmail: string, quotationDetails: any) {
  try {
    const emailHtml = `
      <div>
        <h1>Quotation Reminder</h1>
        <p>Dear Customer,</p>
        <p>This is a friendly reminder regarding your recent quotation for a custom order.</p>
        <p>Quote Reference: ${quotationDetails.quote_reference}</p>
        <p>Amount: $${quotationDetails.quote_amount.toFixed(2)}</p>
        <p>Valid Until: ${new Date(quotationDetails.quote_valid_until).toLocaleDateString()}</p>
        <p>Please let us know if you have any questions.</p>
      </div>
    `

    await resend.emails.send({
      from: "Your Company <noreply@yourcompany.com>",
      to: customerEmail,
      subject: "Reminder: Your Quotation is Waiting",
      html: emailHtml,
    })

    await addQuotationHistory(quotationDetails.id, {
      status: "reminder-sent",
      notes: "Quotation reminder sent to customer.",
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send reminder email." }
  }
}