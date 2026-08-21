import { translate } from '@/i18n/translations';
import type { Destination, Language } from '@/types';

export interface PackingCategory {
  category: string;
  icon: string;
  items: string[];
}

// Generează o listă de bagaje adaptată destinației, climei și duratei.
export function generatePackingList(dest: Destination, days: number, lang: Language = 'ro'): PackingCategory[] {
  const t = (key: string) => translate(lang, key as never);

  const essentials: PackingCategory = {
    category: t('pack.essentials'),
    icon: '🎒',
    items: [
      t('pack.passport'),
      t('pack.tickets'),
      t('pack.cardCash'),
      t('pack.insurance'),
      `${t('pack.phoneCharger')}${dest.currency !== 'EUR' ? t('pack.plugAdapter') : ''}`,
      t('pack.firstAid'),
    ],
  };

  const clothes: PackingCategory = {
    category: t('pack.clothes'),
    icon: '👕',
    items: [],
  };

  switch (dest.climate) {
    case 'calda':
    case 'tropicala':
      clothes.items.push(
        t('pack.lightClothes'),
        t('pack.swimsuit'),
        t('pack.cap'),
        t('pack.sunglasses'),
        t('pack.sandals'),
        t('pack.lightBlouse'),
      );
      break;
    case 'zapada':
      clothes.items.push(
        t('pack.winterJacket'),
        t('pack.thermalLayers'),
        t('pack.glovesScarfHat'),
        t('pack.boots'),
        t('pack.woolSocks'),
        t('pack.snowGlasses'),
      );
      break;
    case 'racoroasa':
      clothes.items.push(
        t('pack.layers'),
        t('pack.midJacket'),
        t('pack.longPants'),
        t('pack.comfyShoes'),
        t('pack.umbrella'),
      );
      break;
    default:
      clothes.items.push(t('pack.layeredClothes'), t('pack.comfyShoesShort'), t('pack.thinJacket'));
  }

  if (days > 7) clothes.items.push(t('pack.laundryDetergent'));

  const toiletries: PackingCategory = {
    category: t('pack.hygiene'),
    icon: '🧴',
    items: [t('pack.toothbrush'), t('pack.toiletries'), t('pack.sunscreen'), t('pack.medication')],
  };
  if (dest.climate === 'tropicala') toiletries.items.push(t('pack.insectSpray'), t('pack.aftersun'));

  const extras: PackingCategory = {
    category: t('pack.useful'),
    icon: '✨',
    items: [t('pack.powerbank'), t('pack.waterBottle'), t('pack.dayBackpack'), t('pack.headphones')],
  };

  // Activități specifice
  if (dest.tags.includes('plaja')) extras.items.push(t('pack.beachTowel'));
  if (dest.tags.includes('munte') || dest.tags.includes('natura'))
    extras.items.push(t('pack.trekkingPole'), t('pack.rainCape'));
  if (dest.tags.includes('cultura')) extras.items.push(t('pack.offlineMap'));

  return [essentials, clothes, toiletries, extras];
}
