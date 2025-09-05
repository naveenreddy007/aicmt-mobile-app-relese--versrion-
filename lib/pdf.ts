import jsPDF from "jspdf"
import "jspdf-autotable"

export function generateQuotationPDF(order: any) {
  const doc = new jsPDF()

  // Add header
  doc.setFontSize(20)
  doc.text("Quotation", 14, 22)

  // Add company details
  doc.setFontSize(12)
  doc.text(`Quote Reference: ${order.quote_reference}`, 14, 40)
  doc.text(`Date: ${new Date(order.quote_sent_at).toLocaleDateString()}`, 14, 46)
  doc.text(`Valid Until: ${new Date(order.quote_valid_until).toLocaleDateString()}`, 14, 52)

  // Add customer details
  doc.text(`To: ${order.company_name}`, 150, 40)
  doc.text(order.contact_name, 150, 46)
  doc.text(order.contact_email, 150, 52)

  // Add table with order details
  const tableColumn = ["Product", "Quantity", "Unit Price", "Total"]
  const tableRows = []

  const row = [order.product_name, order.quantity, "-", `$${order.quote_amount.toFixed(2)}`]
  tableRows.push(row)

  ;(doc as any).autoTable({
    startY: 70,
    head: [tableColumn],
    body: tableRows,
  })

  // Add notes
  doc.setFontSize(12)
  doc.text("Notes", 14, (doc as any).lastAutoTable.finalY + 10)
  doc.text(order.quote_notes, 14, (doc as any).lastAutoTable.finalY + 16)

  // Add footer
  doc.setFontSize(10)
  doc.text("Thank you for your business!", 14, doc.internal.pageSize.height - 10)

  doc.save(`quotation-${order.quote_reference}.pdf`)
}