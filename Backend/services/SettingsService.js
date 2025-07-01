import db from '../models/index.js';

export async function getAll() {
  const settings = await db.Setting.findAll();
  const obj = {};
  settings.forEach(s => { obj[s.key] = JSON.parse(s.value); });
  return obj;
}

export async function updateAll(settingsObj) {
  const entries = Object.entries(settingsObj);
  for (const [key, value] of entries) {
    await db.Setting.upsert({ key, value: JSON.stringify(value) });
  }
} 