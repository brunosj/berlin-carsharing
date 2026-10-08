#!/usr/bin/env node
/**
 * Verifies pricing source URLs are reachable and still contain expected markers.
 * Run after updating src/data/* — does not auto-update prices (Bolt is app-only).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const metaPath = join(__dirname, '../src/data/pricingMeta.json');
const meta = JSON.parse(readFileSync(metaPath, 'utf8'));

const TIMEOUT_MS = 30_000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; berlin-carsharing-pricing-check/1.0; +https://carsharing.landozone.net)';

function normalizeForMatch(text) {
  return text.replace(/\u00a0/g, ' ');
}

async function fetchBody(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      redirect: 'follow',
    });
    const buffer = Buffer.from(await res.arrayBuffer());
    const body = normalizeForMatch(buffer.toString('latin1'));
    return { ok: res.ok, status: res.status, body };
  } finally {
    clearTimeout(timer);
  }
}

function matchesCheck(body, check) {
  const variants = [
    check,
    check.replace(',', '.'),
    check.replace('.', ','),
  ];
  return variants.some((v) => body.includes(v));
}

let failed = false;
let warned = false;

console.log(`Pricing data last updated: ${meta.lastUpdated}\n`);

for (const [providerKey, provider] of Object.entries(meta.providers)) {
  console.log(`[${provider.displayName ?? providerKey}]`);
  for (const source of provider.sources) {
    const label = source.label ?? source.url;
    const optional = source.optional === true;
    process.stdout.write(`  ${label} … `);
    try {
      const { ok, status, body } = await fetchBody(source.url);
      if (!ok) {
        if (optional) {
          warned = true;
          console.log(`WARN (HTTP ${status}, optional — verify manually)`);
        } else {
          failed = true;
          console.log(`FAIL (HTTP ${status})`);
        }
        continue;
      }
      const checks = source.checks ?? [];
      if (checks.length === 0) {
        console.log('OK (reachability only)');
        continue;
      }
      const missing = checks.filter((c) => !matchesCheck(body, c));
      if (missing.length === checks.length) {
        if (optional) {
          warned = true;
          console.log(`WARN (none of ${checks.length} markers, optional)`);
        } else {
          failed = true;
          console.log(`FAIL (none of ${checks.length} markers found)`);
          console.log(`    expected one of: ${checks.join(', ')}`);
        }
      } else if (missing.length > 0) {
        warned = true;
        console.log(`WARN (partial: missing ${missing.join(', ')})`);
      } else {
        console.log('OK');
      }
    } catch (err) {
      if (optional) {
        warned = true;
        const message = err instanceof Error ? err.message : String(err);
        console.log(`WARN (${message}, optional)`);
      } else {
        failed = true;
        const message = err instanceof Error ? err.message : String(err);
        console.log(`FAIL (${message})`);
      }
    }
  }
  console.log('');
}

if (failed) {
  console.error(
    'Some pricing sources failed — review pages and update src/data/* + pricingMeta.json checks if tariffs changed.'
  );
  process.exit(1);
}

if (warned) {
  console.log(
    'Required checks passed. Optional/manual sources had warnings (often bot protection on SIXT).'
  );
} else {
  console.log('All pricing source checks passed.');
}
