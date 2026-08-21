import type { Destination, Language } from '@/types';
import { countryLabel } from '@/i18n/countries';

// Traduceri pentru textele descriptive ale celor 10 destinații demonstrative.
// Numele proprii (hoteluri, restaurante, obiective, cartiere) rămân neschimbate
// în toate limbile — practică standard chiar și pe site-uri reale de turism.

const LANGUAGE_NAMES: Record<string, { en: string; ru: string }> = {
  greacă: { en: 'Greek', ru: 'греческий' },
  engleză: { en: 'English', ru: 'английский' },
  japoneză: { en: 'Japanese', ru: 'японский' },
  spaniolă: { en: 'Spanish', ru: 'испанский' },
  catalană: { en: 'Catalan', ru: 'каталанский' },
  indoneziană: { en: 'Indonesian', ru: 'индонезийский' },
  germană: { en: 'German', ru: 'немецкий' },
  franceză: { en: 'French', ru: 'французский' },
  portugheză: { en: 'Portuguese', ru: 'португальский' },
  dhivehi: { en: 'Dhivehi', ru: 'дивехи' },
  italiană: { en: 'Italian', ru: 'итальянский' },
  cehă: { en: 'Czech', ru: 'чешский' },
};

function localizeLanguageName(lang: Language, ro: string): string {
  if (lang === 'ro') return ro;
  return LANGUAGE_NAMES[ro]?.[lang] ?? ro;
}

interface AttractionText {
  category: string;
  description: string;
}
interface RestaurantText {
  cuisine: string;
  note: string;
}
interface DestText {
  shortDescription: string;
  description: string;
  highlights: string[];
  goodToKnow: string[];
  attractions: AttractionText[]; // aceeași ordine ca în destinations.ts
  restaurants: RestaurantText[]; // aceeași ordine ca în destinations.ts
}

const EN: Record<string, DestText> = {
  santorini: {
    shortDescription: 'Whitewashed houses on cliffs, legendary sunsets over the volcanic caldera.',
    description:
      "Santorini is the jewel of the Aegean: villages of white houses and blue domes clinging to steep cliffs, sunsets that paint the sky orange, and unique volcanic beaches. Perfect for romantic getaways and luxury relaxation.",
    highlights: ['Sunsets in Oia', 'Villages on cliffs', 'Volcanic beaches', 'Local wines'],
    goodToKnow: ['Busy in summer — book ahead', 'The terrain is hilly, wear comfortable shoes'],
    attractions: [
      { category: 'Scenery', description: 'The most famous sunset in Greece — arrive early for a good spot.' },
      { category: 'Beach', description: 'Volcanic beach with striking red cliffs.' },
      { category: 'History', description: 'Minoan town preserved under volcanic ash.' },
      { category: 'Adventure', description: 'Boat tour to the hot springs and the volcanic island.' },
    ],
    restaurants: [
      { cuisine: 'Mediterranean fine dining', note: 'Book a table at sunset, the view is spectacular.' },
      { cuisine: 'Fresh fish', note: 'The best fish in the harbor, generous portions.' },
      { cuisine: 'Greek street food', note: 'Quick and cheap souvlaki between sights.' },
    ],
  },
  kyoto: {
    shortDescription: 'Golden temples, zen gardens and geisha districts.',
    description:
      "Kyoto is the cultural heart of Japan: over 1,600 Buddhist temples, meticulously kept zen gardens, bamboo paths and traditional districts where time seems to stand still. A paradise for culture and food lovers.",
    highlights: ['Historic temples', 'Bamboo forest', 'Tea ceremony', 'Sakura season'],
    goodToKnow: ['Get a Japan Rail Pass', 'Spring and autumn are the most beautiful'],
    attractions: [
      { category: 'Temple', description: 'Thousands of red torii gates up the mountain.' },
      { category: 'Nature', description: 'Tall bamboo alley, magical early in the morning.' },
      { category: 'Temple', description: 'Temple covered in gold leaf, reflected in the lake.' },
      { category: 'Culture', description: 'Traditional streets, you might spot a geisha in the evening.' },
    ],
    restaurants: [
      { cuisine: 'Kaiseki (traditional set menu)', note: 'A Michelin-starred culinary experience.' },
      { cuisine: 'Varied street food', note: '"Kyoto\'s kitchen" — try a bit of everything.' },
      { cuisine: 'Ramen', note: 'Creamy ramen, a queue but worth it.' },
    ],
  },
  barcelona: {
    shortDescription: "Gaudí's architecture, city beaches and endless tapas.",
    description:
      "Barcelona combines Gaudí's art, Mediterranean beaches right in the city, a vibrant food scene and legendary nightlife. Ideal for a dynamic city break that has it all.",
    highlights: ["Gaudí's works", 'Tapas & wine', 'City beaches', 'Nightlife'],
    goodToKnow: ['Watch your pockets in crowded areas', 'Book Sagrada tickets online'],
    attractions: [
      { category: 'Architecture', description: "Gaudí's unfinished masterpiece." },
      { category: 'Park', description: 'Colorful mosaics and city views.' },
      { category: 'History', description: 'Medieval streets and hidden little squares.' },
      { category: 'Beach', description: 'Urban beach with beach bars and sports.' },
    ],
    restaurants: [
      { cuisine: 'Avant-garde Catalan', note: 'One of the best restaurants in the world.' },
      { cuisine: 'Traditional tapas', note: 'An authentic tapas bar, always packed.' },
      { cuisine: 'Food market', note: 'Fresh juices and jamón made on the spot.' },
    ],
  },
  bali: {
    shortDescription: 'Rice terraces, temples on the water, and tropical beaches.',
    description:
      "Bali is the island of the gods: intensely green rice terraces, spectacular Hindu temples, surf beaches and a unique wellness culture. Perfect for relaxation, nature and adventure alike.",
    highlights: ['Rice terraces', 'Hindu temples', 'Wellness & yoga', 'Surf'],
    goodToKnow: ['Avoid the rainy season (Nov–Mar)', 'Rent a scooter with care'],
    attractions: [
      { category: 'Nature', description: 'Spectacular green terraces near Ubud.' },
      { category: 'Temple', description: 'A temple on a rock in the ocean, magical at sunset.' },
      { category: 'Nature', description: 'Jungle waterfall, ideal for a swim.' },
      { category: 'Adventure', description: 'Friendly waves for beginners.' },
    ],
    restaurants: [
      { cuisine: 'Local fine dining', note: 'Tasting menu made from Balinese ingredients.' },
      { cuisine: 'Traditional Balinese', note: 'Suckling pig, a local specialty.' },
      { cuisine: 'Beach club', note: 'Sunset cocktails by the ocean.' },
    ],
  },
  zermatt: {
    shortDescription: 'The Matterhorn, perfect slopes and a car-free village.',
    description:
      "Zermatt is the alpine paradise at the foot of the mighty Matterhorn: a picturesque car-free village, world-class ski slopes, spectacular hikes and clean mountain air. Ideal for skiing in winter, trekking in summer.",
    highlights: ['The Matterhorn', 'Premium skiing', 'Car-free village', 'Panoramic trains'],
    goodToKnow: ['Only reachable by train from Täsch', 'Expensive — plan your budget carefully'],
    attractions: [
      { category: 'Panorama', description: 'The highest panoramic point in the Alps, by cable car.' },
      { category: 'Panoramic train', description: 'Cogwheel train to spectacular views.' },
      { category: 'Adventure', description: 'Over 360 km of slopes for all levels.' },
      { category: 'Trekking', description: 'The 5 Lakes trail with the Matterhorn reflected in the water.' },
    ],
    restaurants: [
      { cuisine: 'Alpine fine dining', note: 'A Michelin star, an unforgettable experience.' },
      { cuisine: 'Traditional mountain fare', note: 'Fondue with a view of the Matterhorn.' },
      { cuisine: 'Bistro', note: 'Good burgers after a day on the slopes.' },
    ],
  },
  lisabona: {
    shortDescription: 'Yellow trams, cliffs, fado and pastéis de nata.',
    description:
      "Lisbon charms with its hills, historic yellow trams, colorful neighborhoods, fado music and a superb Atlantic coast nearby. An affordable, warm and soulful city break.",
    highlights: ['Historic trams', 'Fado', 'Pastéis de nata', 'Sintra nearby'],
    goodToKnow: ['Wear comfortable shoes — lots of hills', 'Sintra deserves a full day'],
    attractions: [
      { category: 'History', description: 'UNESCO monuments from the age of great discoveries.' },
      { category: 'Experience', description: 'A scenic ride through the historic neighborhoods.' },
      { category: 'Castle', description: 'Panoramic views over the city and the river.' },
      { category: 'Full day', description: 'Fairy-tale palaces in the nearby mountains.' },
    ],
    restaurants: [
      { cuisine: 'Portuguese fine dining', note: 'Two Michelin stars, chef José Avillez.' },
      { cuisine: 'Food hall', note: 'Dozens of stalls from top chefs.' },
      { cuisine: 'Pastry shop', note: 'The original tarts, a secret recipe since 1837.' },
    ],
  },
  maldive: {
    shortDescription: 'Overwater villas, coral reefs and tropical luxury.',
    description:
      "The Maldives are the definition of paradise: crystal-clear turquoise waters, villas suspended above the ocean, coral reefs for snorkeling and absolute stillness. The romantic destination par excellence.",
    highlights: ['Overwater villas', 'Coral reefs', 'Turquoise waters', 'Privacy'],
    goodToKnow: ['Seaplane transfer between atolls', 'Choose your resort carefully — you\'re "stuck" on the island'],
    attractions: [
      { category: 'Nature', description: 'Colorful coral, turtles and tropical fish.' },
      { category: 'Experience', description: 'Pods of dolphins offshore at sunset.' },
      { category: 'Phenomenon', description: 'The waves glow at night — a natural spectacle.' },
      { category: 'Adventure', description: 'Swimming alongside the largest fish in the world.' },
    ],
    restaurants: [
      { cuisine: 'Underwater fine dining', note: 'A restaurant below sea level, unique in the world.' },
      { cuisine: 'Seafood', note: 'Fresh grilled fish on the beach.' },
      { cuisine: 'Local Maldivian', note: 'Authentic fish curry in Maafushi.' },
    ],
  },
  roma: {
    shortDescription: 'The eternal city: the Colosseum, the Vatican and divine pasta.',
    description:
      "Rome is an open-air museum: ancient ruins, baroque fountains, the Vatican and the best Italian food. Every corner breathes over 2,000 years of history. Ideal for culture and food.",
    highlights: ['The Colosseum', 'The Vatican', 'Baroque fountains', 'Pasta & gelato'],
    goodToKnow: ['Book tickets online — long queues', 'Public fountains have free drinking water'],
    attractions: [
      { category: 'History', description: 'The ancient amphitheater and the heart of imperial Rome.' },
      { category: 'Art', description: "Michelangelo's masterpiece and priceless collections." },
      { category: 'Monument', description: 'Throw a coin to guarantee your return to Rome.' },
      { category: 'Architecture', description: 'The best-preserved ancient building.' },
    ],
    restaurants: [
      { cuisine: 'Italian fine dining', note: 'Three Michelin stars, a view over Rome.' },
      { cuisine: 'Trattoria & deli', note: 'The best cacio e pepe, book ahead.' },
      { cuisine: 'Roman street food', note: 'Crispy supplì, perfect on the go.' },
    ],
  },
  'costa-rica': {
    shortDescription: 'Jungle, volcanoes, zip-lines and beaches on two oceans.',
    description:
      "Costa Rica is a paradise for adventure and nature: tropical forests teeming with life, active volcanoes, zip-lines above the jungle, beaches on both the Pacific and the Caribbean. \"Pura vida\" — a way of life.",
    highlights: ['Volcanoes & hot springs', 'Rich wildlife', 'Zip-lines', 'Pura vida'],
    goodToKnow: ['Rent a 4x4 for country roads', 'Dry season: Dec–Apr'],
    attractions: [
      { category: 'Nature', description: 'A hike to the volcano followed by relaxing in the hot springs.' },
      { category: 'Adventure', description: 'A zip-line ride above the cloud forest.' },
      { category: 'Wildlife', description: 'Monkeys, sloths and wild beaches.' },
      { category: 'Adventure', description: 'Whitewater through the jungle.' },
    ],
    restaurants: [
      { cuisine: 'Costa Rican fine dining', note: "Chef's cuisine made from local ingredients." },
      { cuisine: 'Traditional (soda)', note: 'Authentic casado at a low price.' },
      { cuisine: 'Seafood', note: 'Fresh ceviche by the ocean.' },
    ],
  },
  praga: {
    shortDescription: 'A fairy-tale city with a castle, bridges and legendary beer.',
    description:
      'Prague, the "city of a hundred spires", takes you through centuries of Gothic and baroque architecture, medieval bridges, an imposing castle and the best beer in the world — all at affordable prices.',
    highlights: ['Prague Castle', 'Charles Bridge', 'Excellent beer', 'Low prices'],
    goodToKnow: ['Only exchange money at official offices', 'The center is best explored on foot'],
    attractions: [
      { category: 'Castle', description: 'The largest castle complex in the world.' },
      { category: 'Monument', description: 'A Gothic bridge with statues, magical in the morning.' },
      { category: 'History', description: 'A show every hour in the Old Town Square.' },
      { category: 'Experience', description: 'The city seen from the water, lovely in the evening.' },
    ],
    restaurants: [
      { cuisine: 'Bohemian fine dining', note: 'A Michelin star, a modern Czech tasting menu.' },
      { cuisine: 'Czech cuisine & beer', note: 'Fresh Pilsner and authentic goulash.' },
      { cuisine: 'Open sandwiches (chlebíčky)', note: 'Modern Czech snacks, perfect for lunch.' },
    ],
  },
};

const RU: Record<string, DestText> = {
  santorini: {
    shortDescription: 'Белые дома на скалах, легендарные закаты над вулканической кальдерой.',
    description:
      'Санторини — жемчужина Эгейского моря: деревни с белыми домами и синими куполами на крутых утёсах, закаты, окрашивающие небо в оранжевый цвет, и уникальные вулканические пляжи. Идеален для романтических поездок и роскошного отдыха.',
    highlights: ['Закаты в Ие', 'Деревни на утёсах', 'Вулканические пляжи', 'Местные вина'],
    goodToKnow: ['Летом многолюдно — бронируйте заранее', 'Местность холмистая, наденьте удобную обувь'],
    attractions: [
      { category: 'Пейзаж', description: 'Самый знаменитый закат в Греции — приходите рано, чтобы занять место.' },
      { category: 'Пляж', description: 'Вулканический пляж с впечатляющими красными скалами.' },
      { category: 'История', description: 'Минойский город, сохранившийся под вулканическим пеплом.' },
      { category: 'Приключение', description: 'Морская прогулка к горячим источникам и вулканическому острову.' },
    ],
    restaurants: [
      { cuisine: 'Средиземноморская высокая кухня', note: 'Забронируйте столик на закате, вид впечатляющий.' },
      { cuisine: 'Свежая рыба', note: 'Лучшая рыба в порту, щедрые порции.' },
      { cuisine: 'Греческий стрит-фуд', note: 'Быстрый и недорогой сувлаки между достопримечательностями.' },
    ],
  },
  kyoto: {
    shortDescription: 'Золотые храмы, дзен-сады и кварталы гейш.',
    description:
      'Киото — культурное сердце Японии: более 1600 буддийских храмов, тщательно ухоженные дзен-сады, бамбуковые аллеи и традиционные кварталы, где время как будто остановилось. Рай для любителей культуры и гастрономии.',
    highlights: ['Исторические храмы', 'Бамбуковый лес', 'Чайная церемония', 'Сезон сакуры'],
    goodToKnow: ['Возьмите Japan Rail Pass', 'Весна и осень — самое красивое время'],
    attractions: [
      { category: 'Храм', description: 'Тысячи красных ворот тории на горе.' },
      { category: 'Природа', description: 'Аллея высокого бамбука, волшебная рано утром.' },
      { category: 'Храм', description: 'Храм, покрытый золотой фольгой, отражается в озере.' },
      { category: 'Культура', description: 'Традиционные улочки, вечером можно увидеть гейшу.' },
    ],
    restaurants: [
      { cuisine: 'Кайсэки (традиционный сет)', note: 'Гастрономический опыт со звездой Мишлен.' },
      { cuisine: 'Разнообразный стрит-фуд', note: '«Кухня Киото» — попробуйте всего понемногу.' },
      { cuisine: 'Рамен', note: 'Кремовый рамен, очередь, но того стоит.' },
    ],
  },
  barcelona: {
    shortDescription: 'Архитектура Гауди, городские пляжи и бесконечные тапас.',
    description:
      'Барселона сочетает искусство Гауди, средиземноморские пляжи прямо в городе, яркую гастрономическую сцену и легендарную ночную жизнь. Идеальна для динамичного городского тура со всем понемногу.',
    highlights: ['Работы Гауди', 'Тапас и вино', 'Городские пляжи', 'Ночная жизнь'],
    goodToKnow: ['Следите за карманами в людных местах', 'Бронируйте билеты в Саграду онлайн'],
    attractions: [
      { category: 'Архитектура', description: 'Незавершённый шедевр Гауди.' },
      { category: 'Парк', description: 'Цветная мозаика и виды на город.' },
      { category: 'История', description: 'Средневековые улочки и скрытые площади.' },
      { category: 'Пляж', description: 'Городской пляж с барами и спортом.' },
    ],
    restaurants: [
      { cuisine: 'Авангардная каталонская кухня', note: 'Один из лучших ресторанов мира.' },
      { cuisine: 'Традиционные тапас', note: 'Аутентичный бар тапас, всегда полон.' },
      { cuisine: 'Гастрономический рынок', note: 'Свежие соки и хамон на месте.' },
    ],
  },
  bali: {
    shortDescription: 'Рисовые террасы, храмы на воде и тропические пляжи.',
    description:
      'Бали — остров богов: насыщенно-зелёные рисовые террасы, впечатляющие индуистские храмы, пляжи для сёрфинга и уникальная культура велнеса. Идеален для отдыха, природы и приключений одновременно.',
    highlights: ['Рисовые террасы', 'Индуистские храмы', 'Велнес и йога', 'Сёрфинг'],
    goodToKnow: ['Избегайте сезона дождей (ноя–мар)', 'Арендуйте скутер осторожно'],
    attractions: [
      { category: 'Природа', description: 'Впечатляющие зелёные террасы возле Убуда.' },
      { category: 'Храм', description: 'Храм на скале в океане, волшебный на закате.' },
      { category: 'Природа', description: 'Водопад в джунглях, идеален для купания.' },
      { category: 'Приключение', description: 'Дружелюбные волны для начинающих.' },
    ],
    restaurants: [
      { cuisine: 'Местная высокая кухня', note: 'Дегустационное меню из балийских ингредиентов.' },
      { cuisine: 'Традиционная балийская кухня', note: 'Жареный поросёнок, местный деликатес.' },
      { cuisine: 'Пляжный клуб', note: 'Коктейли на закате у океана.' },
    ],
  },
  zermatt: {
    shortDescription: 'Маттерхорн, идеальные трассы и деревня без машин.',
    description:
      'Церматт — альпийский рай у подножия величественного Маттерхорна: живописная деревня без машин, горнолыжные трассы мирового класса, впечатляющие походы и чистый горный воздух. Идеален зимой для лыж, летом для треккинга.',
    highlights: ['Маттерхорн', 'Премиальные лыжи', 'Деревня без машин', 'Панорамные поезда'],
    goodToKnow: ['Добраться можно только поездом из Тэша', 'Дорого — тщательно планируйте бюджет'],
    attractions: [
      { category: 'Панорама', description: 'Самая высокая смотровая точка в Альпах, на канатной дороге.' },
      { category: 'Панорамный поезд', description: 'Зубчатая железная дорога к впечатляющим видам.' },
      { category: 'Приключение', description: 'Более 360 км трасс для всех уровней.' },
      { category: 'Треккинг', description: 'Маршрут пяти озёр с отражением Маттерхорна.' },
    ],
    restaurants: [
      { cuisine: 'Альпийская высокая кухня', note: 'Звезда Мишлен, незабываемые впечатления.' },
      { cuisine: 'Традиционная горная кухня', note: 'Фондю с видом на Маттерхорн.' },
      { cuisine: 'Бистро', note: 'Хорошие бургеры после дня на склонах.' },
    ],
  },
  lisabona: {
    shortDescription: 'Жёлтые трамваи, утёсы, фаду и пастел де ната.',
    description:
      'Лиссабон очаровывает своими холмами, историческими жёлтыми трамваями, цветными кварталами, музыкой фаду и великолепным атлантическим побережьем неподалёку. Доступный, тёплый и душевный городской тур.',
    highlights: ['Исторические трамваи', 'Фаду', 'Пастел де ната', 'Синтра неподалёку'],
    goodToKnow: ['Наденьте удобную обувь — много холмов', 'Синтра заслуживает целого дня'],
    attractions: [
      { category: 'История', description: 'Памятники ЮНЕСКО эпохи великих открытий.' },
      { category: 'Впечатление', description: 'Живописная поездка по историческим кварталам.' },
      { category: 'Замок', description: 'Панорамные виды на город и реку.' },
      { category: 'Целый день', description: 'Сказочные дворцы в горах неподалёку.' },
    ],
    restaurants: [
      { cuisine: 'Португальская высокая кухня', note: 'Две звезды Мишлен, шеф Жозе Авиллеш.' },
      { cuisine: 'Фуд-холл', note: 'Десятки прилавков от лучших шефов.' },
      { cuisine: 'Кондитерская', note: 'Оригинальные тарталетки, секретный рецепт с 1837 года.' },
    ],
  },
  maldive: {
    shortDescription: 'Виллы над водой, коралловые рифы и тропическая роскошь.',
    description:
      'Мальдивы — это определение рая: кристально чистая бирюзовая вода, виллы, подвешенные над океаном, коралловые рифы для сноркелинга и абсолютная тишина. Романтическое направление по преимуществу.',
    highlights: ['Виллы над водой', 'Коралловые рифы', 'Бирюзовая вода', 'Уединение'],
    goodToKnow: ['Трансфер на гидросамолёте между атоллами', 'Выбирайте курорт внимательно — вы «привязаны» к острову'],
    attractions: [
      { category: 'Природа', description: 'Цветные кораллы, черепахи и тропические рыбы.' },
      { category: 'Впечатление', description: 'Стаи дельфинов в открытом море на закате.' },
      { category: 'Явление', description: 'Волны светятся ночью — природное зрелище.' },
      { category: 'Приключение', description: 'Плавание рядом с самыми большими рыбами в мире.' },
    ],
    restaurants: [
      { cuisine: 'Подводная высокая кухня', note: 'Ресторан ниже уровня моря, единственный в мире.' },
      { cuisine: 'Морепродукты', note: 'Свежая рыба на гриле на пляже.' },
      { cuisine: 'Местная мальдивская кухня', note: 'Аутентичное рыбное карри в Маафуши.' },
    ],
  },
  roma: {
    shortDescription: 'Вечный город: Колизей, Ватикан и божественная паста.',
    description:
      'Рим — музей под открытым небом: древние руины, барочные фонтаны, Ватикан и лучшая итальянская еда. Каждый уголок дышит более чем 2000-летней историей. Идеален для культуры и гастрономии.',
    highlights: ['Колизей', 'Ватикан', 'Барочные фонтаны', 'Паста и джелато'],
    goodToKnow: ['Бронируйте билеты онлайн — большие очереди', 'В общественных фонтанах бесплатная питьевая вода'],
    attractions: [
      { category: 'История', description: 'Древний амфитеатр и сердце имперского Рима.' },
      { category: 'Искусство', description: 'Шедевр Микеланджело и бесценные коллекции.' },
      { category: 'Памятник', description: 'Бросьте монетку, чтобы вернуться в Рим.' },
      { category: 'Архитектура', description: 'Лучше всего сохранившееся античное здание.' },
    ],
    restaurants: [
      { cuisine: 'Итальянская высокая кухня', note: 'Три звезды Мишлен, вид на Рим.' },
      { cuisine: 'Траттория и гастрономия', note: 'Лучшая качо э пепе, бронируйте заранее.' },
      { cuisine: 'Римский стрит-фуд', note: 'Хрустящие суппли, идеальны на ходу.' },
    ],
  },
  'costa-rica': {
    shortDescription: 'Джунгли, вулканы, зиплайны и пляжи на двух океанах.',
    description:
      'Коста-Рика — рай для приключений и природы: тропические леса, кишащие жизнью, действующие вулканы, зиплайны над джунглями, пляжи и на Тихом океане, и на Карибском море. «Pura vida» — философия жизни.',
    highlights: ['Вулканы и термальные источники', 'Богатая фауна', 'Зиплайны', 'Pura vida'],
    goodToKnow: ['Арендуйте 4x4 для просёлочных дорог', 'Сухой сезон: дек–апр'],
    attractions: [
      { category: 'Природа', description: 'Поход к вулкану, затем отдых в термальных источниках.' },
      { category: 'Приключение', description: 'Полёт на зиплайне над облачным лесом.' },
      { category: 'Фауна', description: 'Обезьяны, ленивцы и дикие пляжи.' },
      { category: 'Приключение', description: 'Бурные воды через джунгли.' },
    ],
    restaurants: [
      { cuisine: 'Костариканская высокая кухня', note: 'Авторская кухня из местных ингредиентов.' },
      { cuisine: 'Традиционная кухня (сода)', note: 'Аутентичный касадо по низкой цене.' },
      { cuisine: 'Морепродукты', note: 'Свежее севиче у океана.' },
    ],
  },
  praga: {
    shortDescription: 'Сказочный город с замком, мостами и легендарным пивом.',
    description:
      'Прага, «город ста шпилей», проведёт вас через века готической и барочной архитектуры, средневековые мосты, внушительный замок и лучшее пиво в мире — и всё по доступным ценам.',
    highlights: ['Пражский Град', 'Карлов мост', 'Отличное пиво', 'Низкие цены'],
    goodToKnow: ['Меняйте деньги только в официальных пунктах', 'Центр лучше исследовать пешком'],
    attractions: [
      { category: 'Замок', description: 'Крупнейший замковый комплекс в мире.' },
      { category: 'Памятник', description: 'Готический мост со статуями, волшебный утром.' },
      { category: 'История', description: 'Представление каждый час на Староместской площади.' },
      { category: 'Впечатление', description: 'Город, увиденный с воды, прекрасен вечером.' },
    ],
    restaurants: [
      { cuisine: 'Богемская высокая кухня', note: 'Звезда Мишлен, современное чешское дегустационное меню.' },
      { cuisine: 'Чешская кухня и пиво', note: 'Свежий пилснер и аутентичный гуляш.' },
      { cuisine: 'Открытые бутерброды (хлебички)', note: 'Современные чешские закуски, идеальны на обед.' },
    ],
  },
};

const CONTENT: Record<'en' | 'ru', Record<string, DestText>> = { en: EN, ru: RU };

export function localizeDestination(dest: Destination, lang: Language): Destination {
  if (lang === 'ro') return dest;
  const t = CONTENT[lang][dest.id];
  if (!t) return dest;
  return {
    ...dest,
    country: countryLabel(lang, dest.country),
    languages: dest.languages.map((l) => localizeLanguageName(lang, l)),
    shortDescription: t.shortDescription,
    description: t.description,
    highlights: t.highlights,
    goodToKnow: t.goodToKnow,
    attractions: dest.attractions.map((a, i) => ({
      ...a,
      category: t.attractions[i]?.category ?? a.category,
      description: t.attractions[i]?.description ?? a.description,
    })),
    restaurants: dest.restaurants.map((r, i) => ({
      ...r,
      cuisine: t.restaurants[i]?.cuisine ?? r.cuisine,
      note: t.restaurants[i]?.note ?? r.note,
    })),
  };
}
