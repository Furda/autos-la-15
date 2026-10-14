/**
 * Renders odd/handoff/Cloudflare-Autos-La-15-Guia-Dominio-Cliente.html to PDF (A4).
 * Matches render settings used for Cloudflare-Autos-La-15-Guia-Cliente.pdf.
 * Usage: node odd/handoff/render-guia-dominio-pdf.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'Cloudflare-Autos-La-15-Guia-Dominio-Cliente.html');
const pdfPath = path.join(__dirname, 'Cloudflare-Autos-La-15-Guia-Dominio-Cliente.pdf');
const htmlUrl = `file://${htmlPath.replace(/\\/g, '/')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(htmlUrl, { waitUntil: 'networkidle' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
console.log('Wrote', pdfPath);
