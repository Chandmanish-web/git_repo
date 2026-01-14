import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', 'data.json');
const adapter = new JSONFile(file);
// provide default data to avoid lowdb constructor error
const defaultData = { contacts: [], startnow: [], users: [] };
const db = new Low(adapter, defaultData);

async function init(){
  await db.read();
  // ensure defaults exist
  db.data = db.data || defaultData;
  await db.write();
}

export { db, init };
