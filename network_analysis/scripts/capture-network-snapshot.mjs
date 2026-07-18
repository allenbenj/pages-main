import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const endpoint = process.env.NETWORK_ANALYSIS_API_URL || 'http://127.0.0.1:3000/api/network-analysis';
const candidatePath = resolve(root, 'data', 'network-analysis.candidate.json');

async function main() {
  let response;
  try {
    response = await fetch(endpoint, { headers: { accept: 'application/json' } });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not reach the network-analysis API at ${endpoint}. Start the authoritative local service or set NETWORK_ANALYSIS_API_URL to its URL. (${reason})`);
  }
  if (!response.ok) throw new Error(`Could not capture network data from ${endpoint}: HTTP ${response.status}`);

  const payload = await response.json();
  if (!Array.isArray(payload?.entities) || !Array.isArray(payload?.relationships) || !payload?.summary) {
    throw new Error('The API response does not match the expected graph payload.');
  }

  await mkdir(resolve(root, 'data'), { recursive: true });
  await writeFile(candidatePath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Captured candidate snapshot: ${payload.entities.length} entities, ${payload.relationships.length} relationships.`);
  console.log(`Review ${candidatePath} before replacing data/network-analysis.reviewed.json.`);
}

main().catch((error) => {
  console.error(`Snapshot capture failed: ${error.message}`);
  process.exitCode = 1;
});