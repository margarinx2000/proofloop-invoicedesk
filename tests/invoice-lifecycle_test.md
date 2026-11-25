---
url: http://localhost:4173
tags: [lifecycle, smoke]
headless: true
---

# Invoice lifecycle: create, save, mark paid

## Create a simple invoice

Open the app. Type "Beta LLC" into the Client name field. In the first line item row, type "Consulting" as the description, set the quantity to 1 and the unit price to 200. Leave Discount % and Tax % at 0 and verify the Grand total shows $200.00.

## Save it

Click "Save invoice" and verify the Invoices list contains an invoice for Beta LLC with total $200.00 and status Unpaid. Verify the header stats show Total billed $200.00, Collected $0.00 and Outstanding $200.00.

## Mark it paid

Click the "Mark paid" button on the Beta LLC invoice. Verify its status badge now reads Paid, and the header stats show Collected $200.00 and Outstanding $0.00.
