import { destinations } from '@/data/destinations';
import type { Continent } from '@/data/cities';

// ─────────────────────────────────────────────────────────────
//  Alegerea imaginii pentru fiecare oraș.
//
//  • Orașele care corespund destinațiilor noastre curate primesc
//    imaginea lor reală (Roma, Barcelona, Kyoto, Praga, ...).
//  • Restul primesc o imagine dintr-un pool TEMATIC pe continent.
//
//  Pool-urile folosesc DOAR ID-uri de imagini deja verificate în
//  aplicație (din setul de destinații), ca să se încarce sigur și
//  să nu apară landmark-uri recognoscibile la orașul greșit.
//
//  Pentru fotografii exacte per oraș se poate conecta ulterior un
//  API de imagini (Unsplash/Wikimedia) în această funcție.
// ─────────────────────────────────────────────────────────────

const raw = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// ID-uri verificate (se încarcă), grupate după vibe-ul regiunii.
const POOLS: Record<Continent, string[]> = {
  Europa: [
    'photo-1583422409516-2895a77efded', // panoramă urbană
    'photo-1519677100203-a0e668c92439', // oraș vechi european
    'photo-1541849546-216549ae216d', // stradă europeană
    'photo-1458150945447-7fb764c11a92', // pod peste râu
    'photo-1585208798174-6cedd86e019a', // oraș cald, colorat
    'photo-1588535684398-0d6dc0b2f4f3',
    'photo-1512621776951-a57141f2eefd',
    'photo-1502786129293-79981df4e689', // munți/alpi
  ],
  Asia: [
    'photo-1493976040374-85c8e12f0c0e', // stradă tradițională
    'photo-1545569341-9eb8b30979d9',
    'photo-1478436127897-769e1b3f0f36',
    'photo-1537996194471-e657df975ab4', // templu
    'photo-1518548419970-58e3b4079ab2', // terase verzi
    'photo-1555400038-63f5ba517a47', // plajă tropicală
  ],
  Africa: [
    'photo-1441974231531-c6227db76b6e', // natură/pădure
    'photo-1536431311719-398b6704d4cc',
    'photo-1502085671122-2d218cd434e6',
    'photo-1518548419970-58e3b4079ab2', // peisaj verde
    'photo-1555400038-63f5ba517a47', // coastă
  ],
  'America de Nord': [
    'photo-1583422409516-2895a77efded', // skyline urban
    'photo-1514282401047-d79a71a590e8', // coastă turcoaz
    'photo-1573843981267-be1999ff37cd',
    'photo-1441974231531-c6227db76b6e', // natură
    'photo-1502085671122-2d218cd434e6',
  ],
  'America de Sud': [
    'photo-1502786129293-79981df4e689', // munți
    'photo-1441974231531-c6227db76b6e', // junglă
    'photo-1536431311719-398b6704d4cc',
    'photo-1555400038-63f5ba517a47', // plajă
  ],
  Oceania: [
    'photo-1514282401047-d79a71a590e8', // ocean turcoaz
    'photo-1573843981267-be1999ff37cd',
    'photo-1439066615861-d1af74d74000',
    'photo-1555400038-63f5ba517a47',
  ],
  'Orientul Mijlociu': [
    'photo-1570077188670-e3a8d69ac5ff', // arhitectură albă, cald
    'photo-1601581875309-fafbf2d3ed3a',
    'photo-1585208798174-6cedd86e019a',
    'photo-1613395877344-13d4a8e0d49e',
  ],
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Imaginile reale ale destinațiilor curate, indexate după nume.
const destinationByName: Record<string, string> = {};
for (const d of destinations) {
  destinationByName[d.name.toLowerCase()] = d.image;
}

export function getCityImage(id: string, name: string, continent: Continent): string {
  // 1. Oraș = destinație curată → imaginea ei reală.
  const byName = destinationByName[name.toLowerCase()];
  if (byName) return byName;
  // 2. Altfel → pool tematic pe continent (imagini verificate).
  const pool = POOLS[continent] ?? POOLS.Europa;
  return raw(pool[hash(id) % pool.length]);
}
