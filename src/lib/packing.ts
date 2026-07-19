import type { Destination } from '@/types';

export interface PackingCategory {
  category: string;
  icon: string;
  items: string[];
}

// Generează o listă de bagaje adaptată destinației, climei și duratei.
export function generatePackingList(dest: Destination, days: number): PackingCategory[] {
  const essentials: PackingCategory = {
    category: 'Esențiale',
    icon: '🎒',
    items: [
      'Pașaport / carte de identitate',
      'Bilete și rezervări (digital + print)',
      'Card bancar & ceva numerar',
      'Asigurare de călătorie',
      `Telefon + încărcător${dest.currency !== 'EUR' ? ' + adaptor priză' : ''}`,
      'Trusă de prim ajutor mică',
    ],
  };

  const clothes: PackingCategory = {
    category: 'Îmbrăcăminte',
    icon: '👕',
    items: [],
  };

  switch (dest.climate) {
    case 'calda':
    case 'tropicala':
      clothes.items.push(
        'Haine lejere, din bumbac',
        'Costum de baie (2)',
        'Șapcă / pălărie de soare',
        'Ochelari de soare',
        'Sandale + o pereche comodă',
        'O bluză subțire pentru seri',
      );
      break;
    case 'zapada':
      clothes.items.push(
        'Geacă de iarnă impermeabilă',
        'Straturi termice (base layer)',
        'Mănuși, fular, căciulă',
        'Bocanci / apreschiuri',
        'Șosete groase de lână',
        'Ochelari de soare pentru zăpadă',
      );
      break;
    case 'racoroasa':
      clothes.items.push(
        'Straturi (tricouri + pulovere)',
        'Geacă intermediară',
        'Pantaloni lungi',
        'Pantofi comozi de mers',
        'Umbrelă compactă',
      );
      break;
    default:
      clothes.items.push('Îmbrăcăminte în straturi', 'Pantofi comozi', 'O geacă subțire');
  }

  if (days > 7) clothes.items.push('Detergent de rufe (călătorii lungi)');

  const toiletries: PackingCategory = {
    category: 'Igienă & sănătate',
    icon: '🧴',
    items: [
      'Periuță & pastă de dinți',
      'Deodorant, gel de duș, șampon',
      'Cremă cu protecție solară (SPF 30+)',
      'Medicamente personale',
    ],
  };
  if (dest.climate === 'tropicala') toiletries.items.push('Spray anti-insecte', 'După-plajă / gel aloe');

  const extras: PackingCategory = {
    category: 'Utile',
    icon: '✨',
    items: [
      'Baterie externă (power bank)',
      'Sticlă de apă reutilizabilă',
      'Rucsac mic pentru excursii de zi',
      'Căști',
    ],
  };

  // Activități specifice
  if (dest.tags.includes('plaja')) extras.items.push('Prosop de plajă rapid-uscare');
  if (dest.tags.includes('munte') || dest.tags.includes('natura'))
    extras.items.push('Baston de trekking (opțional)', 'Pelerină de ploaie');
  if (dest.tags.includes('cultura')) extras.items.push('Ghid / hartă offline salvată pe telefon');

  return [essentials, clothes, toiletries, extras];
}
