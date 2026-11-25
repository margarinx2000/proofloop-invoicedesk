# InvoiceDesk — Specification

The tests in `tests/` cite this document. If the app and this spec disagree,
the spec wins and the app has a bug.

## Money rules

1. Line total = quantity × unit price.
2. Subtotal = sum of all line totals.
3. Discount amount = subtotal × discount %.
4. **Tax is charged on the discounted amount only**: taxable = subtotal − discount; tax amount = taxable × tax %.
5. Grand total = taxable + tax amount.

Worked example (used by `tests/invoice-total_test.md`):
2 × $50.00, discount 10%, tax 10% → subtotal $100.00, discount $10.00,
taxable $90.00, tax $9.00, **grand total $99.00**.

## Behaviour rules

- An invoice needs a client name and at least one line item with a
  description, quantity > 0 and price > 0. Saving without them shows an
  error and creates nothing.
- Saved invoices appear newest-first as INV-001, INV-002, … with status
  Unpaid.
- "Mark paid" flips an invoice to Paid.
- Header stats always reflect the saved invoices: Total billed = sum of all
  totals; Collected = sum of Paid totals; Outstanding = billed − collected.
- Invoices persist across page reloads (localStorage).
