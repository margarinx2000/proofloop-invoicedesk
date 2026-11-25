// InvoiceDesk — zero-dependency static server.
// Run: npm start  →  http://localhost:4173
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4173;

const server = createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, app: "invoicedesk" }));
    return;
  }
  if (req.url === "/" || req.url === "/index.html") {
    try {
      const html = await readFile(join(root, "public", "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(500); res.end("index.html missing");
    }
    return;
  }
  res.writeHead(404); res.end("not found");
});

server.listen(PORT, () => {
  console.log(`InvoiceDesk running at http://localhost:${PORT}`);
});
