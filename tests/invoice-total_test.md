---
url: http://localhost:4173
tags: [money, smoke]
headless: true
---

# Invoice total: discount is applied before tax

## Open InvoiceDesk

Open the app and confirm the "InvoiceDesk" heading is visible and the New invoice form is shown with a Grand total of $0.00.

## Enter the invoice details

Type "Acme Studio" into the Client name field. In the first line item row, type "Design work" as the description, set the quantity to 2 and the unit price to 50. Set the Discount % field to 10 and the Tax % field to 10.

## Check the totals

Read the summary panel and verify each value exactly: Subtotal shows $100.00, Discount shows −$10.00, Tax shows $9.00, and Grand total shows $99.00. The check fails if any of these values differ.

## Save the invoice

Click "Save invoice" and verify the Invoices list now contains an invoice for Acme Studio with total $99.00 and status Unpaid.
