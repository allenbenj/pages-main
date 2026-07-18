import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const reviewedPath = resolve(root, 'data', 'network-analysis.reviewed.json');
const outputPath = resolve(root, 'public', 'data', 'network-analysis.json');

function fail(message) {
  throw new Error(`Network snapshot validation failed: ${message}`);
}

function validateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') fail('snapshot must be a JSON object');
  const { entities, relationships, summary } = snapshot;
  if (!Array.isArray(entities)) fail('entities must be an array');
  if (!Array.isArray(relationships)) fail('relationships must be an array');
  if (!summary || typeof summary !== 'object') fail('summary is required');
  if (summary.entityCount !== entities.length) fail('summary.entityCount must match entities.length');
  if (summary.relationshipCount !== relationships.length) fail('summary.relationshipCount must match relationships.length');
  if (!summary.kinds || typeof summary.kinds !== 'object' || Array.isArray(summary.kinds)) fail('summary.kinds must be an object');

  const entityIds = new Set();
  for (const entity of entities) {
    if (!entity || typeof entity !== 'object' || typeof entity.id !== 'string' || !entity.id) fail('every entity needs a non-empty string id');
    if (entityIds.has(entity.id)) fail(`duplicate entity id: ${entity.id}`);
    entityIds.add(entity.id);
  }
  for (const relationship of relationships) {
    if (!relationship || typeof relationship !== 'object' || typeof relationship.id !== 'string' || !relationship.id) fail('every relationship needs a non-empty string id');
    if (!entityIds.has(relationship.sourceId) || !entityIds.has(relationship.targetId)) fail(`relationship ${relationship.id} references an unknown entity`);
  }
}

const snapshot = JSON.parse(await readFile(reviewedPath, 'utf8'));
validateSnapshot(snapshot);
await mkdir(dirname(outputPath), { recursive: true });
await copyFile(reviewedPath, outputPath);
await writeFile(resolve(root, 'public', 'data', 'network-analysis.manifest.json'), `${JSON.stringify({
  source: 'network-analysis.reviewed.json',
  entityCount: snapshot.summary.entityCount,
  relationshipCount: snapshot.summary.relationshipCount,
}, null, 2)}\n`);
console.log(`Prepared reviewed network snapshot: ${snapshot.summary.entityCount} entities, ${snapshot.summary.relationshipCount} relationships.`);