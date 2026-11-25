---
url: http://localhost:4173
tags: [validation]
headless: true
---

# Validation: an empty invoice cannot be saved

## Try to save an empty invoice

Open the app and confirm the Invoices section shows "No invoices yet". Without typing anything, click "Save invoice".

## Check the guard rails

Verify an error message appears asking for a client name, and the Invoices section still shows "No invoices yet". Then type "Gamma Co" into the Client name field and click "Save invoice" again. Verify a different error appears asking for at least one line item, and still no invoice is created.
