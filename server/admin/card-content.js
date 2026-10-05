// The invitation card's editable content: one row in card_content, starting from the proof copy in
// src/config/wedding.js. Whatever is saved is fitted to the proof copy's shape first, so a bad save can't break the card.
import { content as fileContent } from '../../src/config/wedding.js';
import { prisma } from './db.js';

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Template for the items of an array: for objects, every key any item has (so optional ones like `highlight` survive)
const itemTemplate = (arr) =>
  arr.every(isObject) && arr.length ? Object.assign({}, ...arr) : arr[0];

// Keeps `value` where it matches the template's type, falls back to the template where it doesn't.
// Inside array items a missing key stays missing (it is optional there); elsewhere it is filled from the template.
export const conform = (value, template, inItem = false) => {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    const tpl = itemTemplate(template);
    if (tpl === undefined) return value.filter((v) => typeof v === 'string');
    if (typeof tpl !== 'object') return value.filter((v) => typeof v === typeof tpl);
    return value.map((v) => conform(v, tpl, true));
  }
  if (isObject(template)) {
    if (!isObject(value)) return inItem ? {} : template;
    const out = {};
    for (const [k, t] of Object.entries(template)) {
      if (k in value) out[k] = conform(value[k], t, false);
      else if (!inItem) out[k] = t;
    }
    return out;
  }
  return typeof value === typeof template ? value : template;
};

export const defaults = () => structuredClone(fileContent);

export async function loadContent() {
  const row = await prisma.cardContent.findUnique({ where: { id: 'card' } });
  return row ? conform(row.data, fileContent) : defaults();
}

export async function saveContent(data) {
  const clean = conform(data, fileContent);
  const row = await prisma.cardContent.upsert({
    where: { id: 'card' },
    update: { data: clean },
    create: { id: 'card', data: clean },
  });
  return { content: clean, updatedAt: row.updatedAt };
}
