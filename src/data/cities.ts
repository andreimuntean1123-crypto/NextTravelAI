// ─────────────────────────────────────────────────────────────
//  ~1000 de orașe populare din întreaga lume.
//  Structură compactă (țară → orașe), transformată în obiecte City
//  cu câmpuri derivate. Hotelurile pentru fiecare oraș sunt generate
//  la cerere în „src/lib/cityHotels.ts".
// ─────────────────────────────────────────────────────────────

export type Continent =
  | 'Europa'
  | 'Asia'
  | 'Africa'
  | 'America de Nord'
  | 'America de Sud'
  | 'Oceania'
  | 'Orientul Mijlociu';

export interface City {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  image: string;
  priceTier: 1 | 2 | 3; // 1 = accesibil, 3 = scump
  popularity: number; // 0-100
}

interface CountryBlock {
  country: string;
  continent: Continent;
  tier: 1 | 2 | 3;
  cities: string[];
}

import { getCityImage } from '@/data/cityImages';

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// ─── Datele: țară → orașe populare ───────────────────────────
const DATA: CountryBlock[] = [
  // ---------- Europa ----------
  { country: 'România', continent: 'Europa', tier: 1, cities: ['București', 'Cluj-Napoca', 'Brașov', 'Sibiu', 'Timișoara', 'Iași', 'Constanța', 'Sighișoara', 'Oradea', 'Cluj', 'Bran', 'Sinaia', 'Mamaia', 'Alba Iulia', 'Târgu Mureș'] },
  { country: 'Italia', continent: 'Europa', tier: 3, cities: ['Roma', 'Veneția', 'Florența', 'Milano', 'Napoli', 'Torino', 'Verona', 'Bologna', 'Genova', 'Pisa', 'Siena', 'Amalfi', 'Positano', 'Sorrento', 'Capri', 'Como', 'Palermo', 'Catania', 'Bari', 'Rimini'] },
  { country: 'Spania', continent: 'Europa', tier: 2, cities: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Granada', 'Malaga', 'Bilbao', 'San Sebastián', 'Cordoba', 'Toledo', 'Palma de Mallorca', 'Ibiza', 'Marbella', 'Alicante', 'Girona', 'Santiago de Compostela', 'Tenerife', 'Las Palmas', 'Segovia', 'Cádiz'] },
  { country: 'Franța', continent: 'Europa', tier: 3, cities: ['Paris', 'Nisa', 'Lyon', 'Marsilia', 'Bordeaux', 'Nantes', 'Strasbourg', 'Toulouse', 'Cannes', 'Nice', 'Montpellier', 'Lille', 'Avignon', 'Aix-en-Provence', 'Saint-Tropez', 'Chamonix', 'Annecy', 'Colmar', 'Biarritz', 'Reims'] },
  { country: 'Germania', continent: 'Europa', tier: 2, cities: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Dresda', 'Stuttgart', 'Düsseldorf', 'Nürnberg', 'Leipzig', 'Heidelberg', 'Freiburg', 'Baden-Baden', 'Rothenburg', 'Bremen', 'Hannovra'] },
  { country: 'Regatul Unit', continent: 'Europa', tier: 3, cities: ['Londra', 'Edinburgh', 'Manchester', 'Liverpool', 'Glasgow', 'Birmingham', 'Bristol', 'Oxford', 'Cambridge', 'York', 'Bath', 'Brighton', 'Cardiff', 'Belfast', 'Leeds', 'Newcastle', 'Inverness'] },
  { country: 'Portugalia', continent: 'Europa', tier: 1, cities: ['Lisabona', 'Porto', 'Faro', 'Sintra', 'Coimbra', 'Braga', 'Funchal', 'Lagos', 'Aveiro', 'Cascais', 'Évora', 'Albufeira', 'Guimarães'] },
  { country: 'Grecia', continent: 'Europa', tier: 2, cities: ['Atena', 'Salonic', 'Santorini', 'Mykonos', 'Rodos', 'Creta', 'Corfu', 'Nafplio', 'Zakynthos', 'Kos', 'Naxos', 'Paros', 'Chania', 'Delphi', 'Meteora'] },
  { country: 'Olanda', continent: 'Europa', tier: 2, cities: ['Amsterdam', 'Rotterdam', 'Haga', 'Utrecht', 'Eindhoven', 'Maastricht', 'Delft', 'Haarlem', 'Groningen', 'Leiden'] },
  { country: 'Belgia', continent: 'Europa', tier: 2, cities: ['Bruxelles', 'Bruges', 'Anvers', 'Gent', 'Leuven', 'Namur', 'Liège', 'Ostende'] },
  { country: 'Austria', continent: 'Europa', tier: 2, cities: ['Viena', 'Salzburg', 'Innsbruck', 'Graz', 'Hallstatt', 'Linz', 'Kitzbühel', 'Bregenz', 'Klagenfurt'] },
  { country: 'Elveția', continent: 'Europa', tier: 3, cities: ['Zürich', 'Geneva', 'Lucerna', 'Berna', 'Basel', 'Interlaken', 'Zermatt', 'Lausanne', 'Lugano', 'Montreux', 'St. Moritz', 'Grindelwald'] },
  { country: 'Cehia', continent: 'Europa', tier: 1, cities: ['Praga', 'Brno', 'Český Krumlov', 'Karlovy Vary', 'Olomouc', 'Plzeň', 'Kutná Hora'] },
  { country: 'Polonia', continent: 'Europa', tier: 1, cities: ['Varșovia', 'Cracovia', 'Wrocław', 'Gdańsk', 'Poznań', 'Zakopane', 'Łódź', 'Toruń', 'Katowice'] },
  { country: 'Ungaria', continent: 'Europa', tier: 1, cities: ['Budapesta', 'Debrecen', 'Szeged', 'Pécs', 'Eger', 'Győr'] },
  { country: 'Croația', continent: 'Europa', tier: 2, cities: ['Zagreb', 'Dubrovnik', 'Split', 'Zadar', 'Rovinj', 'Hvar', 'Pula', 'Šibenik', 'Rijeka', 'Trogir'] },
  { country: 'Irlanda', continent: 'Europa', tier: 2, cities: ['Dublin', 'Galway', 'Cork', 'Killarney', 'Limerick', 'Kilkenny', 'Waterford'] },
  { country: 'Suedia', continent: 'Europa', tier: 3, cities: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Kiruna', 'Lund'] },
  { country: 'Norvegia', continent: 'Europa', tier: 3, cities: ['Oslo', 'Bergen', 'Tromsø', 'Stavanger', 'Trondheim', 'Ålesund', 'Flåm'] },
  { country: 'Danemarca', continent: 'Europa', tier: 3, cities: ['Copenhaga', 'Aarhus', 'Odense', 'Aalborg', 'Helsingør'] },
  { country: 'Finlanda', continent: 'Europa', tier: 3, cities: ['Helsinki', 'Rovaniemi', 'Turku', 'Tampere', 'Oulu'] },
  { country: 'Islanda', continent: 'Europa', tier: 3, cities: ['Reykjavík', 'Akureyri', 'Vík', 'Hafnarfjörður'] },
  { country: 'Rusia', continent: 'Europa', tier: 2, cities: ['Moscova', 'Sankt Petersburg', 'Kazan', 'Soci', 'Ekaterinburg', 'Novgorod'] },
  { country: 'Turcia', continent: 'Europa', tier: 1, cities: ['Istanbul', 'Antalya', 'Cappadocia', 'Izmir', 'Bodrum', 'Ankara', 'Pamukkale', 'Fethiye', 'Marmaris', 'Bursa', 'Konya', 'Efes'] },
  { country: 'Bulgaria', continent: 'Europa', tier: 1, cities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Nessebar', 'Bansko', 'Veliko Tarnovo'] },
  { country: 'Serbia', continent: 'Europa', tier: 1, cities: ['Belgrad', 'Novi Sad', 'Niš', 'Subotica'] },
  { country: 'Slovenia', continent: 'Europa', tier: 2, cities: ['Ljubljana', 'Bled', 'Piran', 'Maribor', 'Koper'] },
  { country: 'Slovacia', continent: 'Europa', tier: 1, cities: ['Bratislava', 'Košice', 'Poprad', 'Žilina'] },
  { country: 'Ucraina', continent: 'Europa', tier: 1, cities: ['Kiev', 'Liov', 'Odesa', 'Harkov'] },
  { country: 'Moldova', continent: 'Europa', tier: 1, cities: ['Chișinău', 'Bălți', 'Orhei', 'Cricova'] },
  { country: 'Malta', continent: 'Europa', tier: 2, cities: ['Valletta', 'Sliema', 'Mdina', 'St. Julian\'s', 'Gozo'] },
  { country: 'Cipru', continent: 'Europa', tier: 2, cities: ['Nicosia', 'Limassol', 'Paphos', 'Ayia Napa', 'Larnaca'] },
  { country: 'Estonia', continent: 'Europa', tier: 2, cities: ['Tallinn', 'Tartu', 'Pärnu'] },
  { country: 'Letonia', continent: 'Europa', tier: 2, cities: ['Riga', 'Jūrmala', 'Sigulda'] },
  { country: 'Lituania', continent: 'Europa', tier: 2, cities: ['Vilnius', 'Kaunas', 'Klaipėda', 'Trakai'] },
  { country: 'Luxemburg', continent: 'Europa', tier: 3, cities: ['Luxemburg', 'Vianden', 'Echternach'] },
  { country: 'Muntenegru', continent: 'Europa', tier: 2, cities: ['Kotor', 'Budva', 'Podgorica', 'Sveti Stefan'] },
  { country: 'Albania', continent: 'Europa', tier: 1, cities: ['Tirana', 'Sarandë', 'Berat', 'Gjirokastër'] },

  // ---------- Asia ----------
  { country: 'Japonia', continent: 'Asia', tier: 3, cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara', 'Sapporo', 'Nagoya', 'Fukuoka', 'Yokohama', 'Kanazawa', 'Kobe', 'Nikko', 'Hakone', 'Takayama', 'Okinawa'] },
  { country: 'China', continent: 'Asia', tier: 2, cities: ['Beijing', 'Shanghai', 'Xi\'an', 'Chengdu', 'Guangzhou', 'Hangzhou', 'Guilin', 'Shenzhen', 'Suzhou', 'Chongqing', 'Kunming', 'Lhasa', 'Harbin', 'Nanjing'] },
  { country: 'Thailanda', continent: 'Asia', tier: 1, cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Pattaya', 'Koh Samui', 'Ayutthaya', 'Chiang Rai', 'Hua Hin', 'Koh Phi Phi', 'Koh Tao'] },
  { country: 'Vietnam', continent: 'Asia', tier: 1, cities: ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Hoi An', 'Hue', 'Nha Trang', 'Halong', 'Sapa', 'Phu Quoc', 'Da Lat'] },
  { country: 'India', continent: 'Asia', tier: 1, cities: ['Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Goa', 'Varanasi', 'Udaipur', 'Bengaluru', 'Kolkata', 'Chennai', 'Jodhpur', 'Rishikesh', 'Amritsar', 'Kochi'] },
  { country: 'Indonezia', continent: 'Asia', tier: 1, cities: ['Bali', 'Jakarta', 'Ubud', 'Yogyakarta', 'Lombok', 'Bandung', 'Surabaya', 'Gili', 'Komodo'] },
  { country: 'Coreea de Sud', continent: 'Asia', tier: 2, cities: ['Seoul', 'Busan', 'Jeju', 'Incheon', 'Gyeongju', 'Daegu', 'Jeonju'] },
  { country: 'Malaezia', continent: 'Asia', tier: 1, cities: ['Kuala Lumpur', 'Penang', 'Langkawi', 'Malacca', 'Kota Kinabalu', 'Ipoh'] },
  { country: 'Singapore', continent: 'Asia', tier: 3, cities: ['Singapore'] },
  { country: 'Filipine', continent: 'Asia', tier: 1, cities: ['Manila', 'Cebu', 'Boracay', 'Palawan', 'Bohol', 'Davao', 'El Nido'] },
  { country: 'Sri Lanka', continent: 'Asia', tier: 1, cities: ['Colombo', 'Kandy', 'Galle', 'Ella', 'Sigiriya', 'Nuwara Eliya'] },
  { country: 'Nepal', continent: 'Asia', tier: 1, cities: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini'] },
  { country: 'Cambodgia', continent: 'Asia', tier: 1, cities: ['Phnom Penh', 'Siem Reap', 'Sihanoukville', 'Battambang'] },
  { country: 'Maldive', continent: 'Asia', tier: 3, cities: ['Malé', 'Maafushi', 'Hulhumalé'] },
  { country: 'Laos', continent: 'Asia', tier: 1, cities: ['Vientiane', 'Luang Prabang', 'Vang Vieng'] },
  { country: 'Myanmar', continent: 'Asia', tier: 1, cities: ['Yangon', 'Bagan', 'Mandalay', 'Inle Lake'] },
  { country: 'Taiwan', continent: 'Asia', tier: 2, cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Hualien', 'Tainan'] },
  { country: 'Kazahstan', continent: 'Asia', tier: 1, cities: ['Almaty', 'Astana', 'Shymkent'] },
  { country: 'Uzbekistan', continent: 'Asia', tier: 1, cities: ['Tașkent', 'Samarkand', 'Bukhara', 'Khiva'] },

  // ---------- Orientul Mijlociu ----------
  { country: 'Emiratele Arabe Unite', continent: 'Orientul Mijlociu', tier: 3, cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Fujairah'] },
  { country: 'Israel', continent: 'Orientul Mijlociu', tier: 3, cities: ['Ierusalim', 'Tel Aviv', 'Haifa', 'Eilat', 'Nazaret'] },
  { country: 'Iordania', continent: 'Orientul Mijlociu', tier: 2, cities: ['Amman', 'Petra', 'Aqaba', 'Wadi Rum', 'Marea Moartă'] },
  { country: 'Qatar', continent: 'Orientul Mijlociu', tier: 3, cities: ['Doha', 'Al Wakrah'] },
  { country: 'Oman', continent: 'Orientul Mijlociu', tier: 2, cities: ['Muscat', 'Nizwa', 'Salalah'] },
  { country: 'Arabia Saudită', continent: 'Orientul Mijlociu', tier: 2, cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'AlUla'] },
  { country: 'Liban', continent: 'Orientul Mijlociu', tier: 2, cities: ['Beirut', 'Byblos', 'Baalbek'] },
  { country: 'Bahrain', continent: 'Orientul Mijlociu', tier: 2, cities: ['Manama'] },

  // ---------- Africa ----------
  { country: 'Egipt', continent: 'Africa', tier: 1, cities: ['Cairo', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Alexandria', 'Giza', 'Marsa Alam', 'Dahab'] },
  { country: 'Maroc', continent: 'Africa', tier: 1, cities: ['Marrakech', 'Casablanca', 'Fes', 'Chefchaouen', 'Rabat', 'Essaouira', 'Tanger', 'Agadir', 'Merzouga'] },
  { country: 'Africa de Sud', continent: 'Africa', tier: 2, cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Stellenbosch', 'Port Elizabeth', 'Knysna'] },
  { country: 'Tanzania', continent: 'Africa', tier: 2, cities: ['Zanzibar', 'Arusha', 'Dar es Salaam', 'Serengeti', 'Stone Town'] },
  { country: 'Kenya', continent: 'Africa', tier: 2, cities: ['Nairobi', 'Mombasa', 'Masai Mara', 'Diani Beach', 'Nakuru'] },
  { country: 'Tunisia', continent: 'Africa', tier: 1, cities: ['Tunis', 'Hammamet', 'Sousse', 'Djerba', 'Sidi Bou Said'] },
  { country: 'Mauritius', continent: 'Africa', tier: 3, cities: ['Port Louis', 'Grand Baie', 'Flic en Flac'] },
  { country: 'Seychelles', continent: 'Africa', tier: 3, cities: ['Victoria', 'Praslin', 'La Digue'] },
  { country: 'Namibia', continent: 'Africa', tier: 2, cities: ['Windhoek', 'Swakopmund', 'Sossusvlei'] },
  { country: 'Nigeria', continent: 'Africa', tier: 1, cities: ['Lagos', 'Abuja'] },
  { country: 'Etiopia', continent: 'Africa', tier: 1, cities: ['Addis Abeba', 'Lalibela', 'Gondar'] },
  { country: 'Ghana', continent: 'Africa', tier: 1, cities: ['Accra', 'Kumasi'] },

  // ---------- America de Nord ----------
  { country: 'Statele Unite', continent: 'America de Nord', tier: 3, cities: ['New York', 'Los Angeles', 'Las Vegas', 'San Francisco', 'Miami', 'Chicago', 'Orlando', 'Washington', 'Boston', 'Seattle', 'New Orleans', 'San Diego', 'Honolulu', 'Nashville', 'Austin', 'Denver', 'Portland', 'Philadelphia', 'Savannah', 'San Antonio'] },
  { country: 'Canada', continent: 'America de Nord', tier: 2, cities: ['Toronto', 'Vancouver', 'Montreal', 'Quebec', 'Calgary', 'Ottawa', 'Banff', 'Victoria', 'Whistler', 'Halifax'] },
  { country: 'Mexic', continent: 'America de Nord', tier: 1, cities: ['Cancún', 'Ciudad de México', 'Playa del Carmen', 'Tulum', 'Guadalajara', 'Oaxaca', 'Puerto Vallarta', 'Mérida', 'San Miguel de Allende', 'Cabo San Lucas'] },
  { country: 'Cuba', continent: 'America de Nord', tier: 1, cities: ['Havana', 'Varadero', 'Trinidad', 'Viñales'] },
  { country: 'Costa Rica', continent: 'America de Nord', tier: 2, cities: ['San José', 'La Fortuna', 'Manuel Antonio', 'Monteverde', 'Tamarindo', 'Puerto Viejo'] },
  { country: 'Panama', continent: 'America de Nord', tier: 2, cities: ['Panama City', 'Bocas del Toro', 'Boquete'] },
  { country: 'Republica Dominicană', continent: 'America de Nord', tier: 1, cities: ['Punta Cana', 'Santo Domingo', 'Puerto Plata'] },
  { country: 'Jamaica', continent: 'America de Nord', tier: 2, cities: ['Kingston', 'Montego Bay', 'Negril', 'Ocho Rios'] },
  { country: 'Guatemala', continent: 'America de Nord', tier: 1, cities: ['Guatemala City', 'Antigua', 'Lacul Atitlán', 'Flores'] },

  // ---------- America de Sud ----------
  { country: 'Brazilia', continent: 'America de Sud', tier: 2, cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Florianópolis', 'Foz do Iguaçu', 'Manaus', 'Brasília', 'Recife', 'Fortaleza', 'Búzios'] },
  { country: 'Argentina', continent: 'America de Sud', tier: 1, cities: ['Buenos Aires', 'Mendoza', 'Bariloche', 'Ushuaia', 'Salta', 'Córdoba', 'El Calafate', 'Iguazú'] },
  { country: 'Peru', continent: 'America de Sud', tier: 1, cities: ['Lima', 'Cusco', 'Machu Picchu', 'Arequipa', 'Puno', 'Iquitos'] },
  { country: 'Chile', continent: 'America de Sud', tier: 2, cities: ['Santiago', 'Valparaíso', 'Atacama', 'Torres del Paine', 'Puerto Varas', 'Isla de Pascua'] },
  { country: 'Columbia', continent: 'America de Sud', tier: 1, cities: ['Bogotá', 'Cartagena', 'Medellín', 'Cali', 'Santa Marta'] },
  { country: 'Ecuador', continent: 'America de Sud', tier: 1, cities: ['Quito', 'Guayaquil', 'Cuenca', 'Galápagos', 'Baños'] },
  { country: 'Bolivia', continent: 'America de Sud', tier: 1, cities: ['La Paz', 'Uyuni', 'Sucre', 'Santa Cruz'] },
  { country: 'Uruguay', continent: 'America de Sud', tier: 2, cities: ['Montevideo', 'Punta del Este', 'Colonia'] },

  // ---------- Oceania ----------
  { country: 'Australia', continent: 'Oceania', tier: 3, cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Cairns', 'Adelaide', 'Hobart', 'Byron Bay', 'Canberra', 'Darwin'] },
  { country: 'Noua Zeelandă', continent: 'Oceania', tier: 3, cities: ['Auckland', 'Queenstown', 'Wellington', 'Christchurch', 'Rotorua', 'Wanaka', 'Dunedin'] },
  { country: 'Fiji', continent: 'Oceania', tier: 3, cities: ['Suva', 'Nadi', 'Denarau'] },
  { country: 'Polinezia Franceză', continent: 'Oceania', tier: 3, cities: ['Papeete', 'Bora Bora', 'Moorea'] },

  // ---------- Extindere (mai multe orașe / țări) ----------
  { country: 'România', continent: 'Europa', tier: 1, cities: ['Suceava', 'Pitești', 'Craiova', 'Galați', 'Ploiești', 'Baia Mare', 'Deva', 'Bistrița', 'Sfântu Gheorghe', 'Piatra Neamț', 'Râmnicu Vâlcea', 'Buzău', 'Focșani', 'Slănic Moldova', 'Băile Herculane'] },
  { country: 'Italia', continent: 'Europa', tier: 3, cities: ['Lucca', 'Perugia', 'Trieste', 'Padova', 'Ravenna', 'Lecce', 'Matera', 'Cinque Terre', 'Portofino', 'Taormina', 'Assisi', 'Bergamo', 'Modena', 'Parma'] },
  { country: 'Spania', continent: 'Europa', tier: 2, cities: ['Salamanca', 'Zaragoza', 'Ronda', 'Sitges', 'Cuenca', 'Oviedo', 'León', 'Fuerteventura', 'Lanzarote', 'Formentera', 'Menorca', 'Burgos'] },
  { country: 'Franța', continent: 'Europa', tier: 3, cities: ['Rouen', 'Dijon', 'Grenoble', 'Carcassonne', 'Menton', 'Antibes', 'Deauville', 'La Rochelle', 'Tours', 'Metz', 'Nancy', 'Perpignan'] },
  { country: 'Germania', continent: 'Europa', tier: 2, cities: ['Potsdam', 'Regensburg', 'Würzburg', 'Augsburg', 'Konstanz', 'Trier', 'Lübeck', 'Bamberg', 'Garmisch', 'Mainz', 'Erfurt', 'Kiel'] },
  { country: 'Regatul Unit', continent: 'Europa', tier: 3, cities: ['Nottingham', 'Sheffield', 'Aberdeen', 'Portsmouth', 'Canterbury', 'Windsor', 'Stratford-upon-Avon', 'Durham', 'Chester', 'Exeter', 'St Andrews'] },
  { country: 'Grecia', continent: 'Europa', tier: 2, cities: ['Milos', 'Ios', 'Skiathos', 'Kefalonia', 'Lefkada', 'Thassos', 'Samos', 'Olympia', 'Kavala', 'Ioannina'] },
  { country: 'Portugalia', continent: 'Europa', tier: 1, cities: ['Óbidos', 'Nazaré', 'Tavira', 'Setúbal', 'Viana do Castelo', 'Peniche', 'Tomar'] },
  { country: 'Japonia', continent: 'Asia', tier: 3, cities: ['Sendai', 'Kobe', 'Matsumoto', 'Kamakura', 'Nagasaki', 'Kumamoto', 'Beppu', 'Kanazawa', 'Otaru', 'Ise'] },
  { country: 'China', continent: 'Asia', tier: 2, cities: ['Tianjin', 'Qingdao', 'Dalian', 'Zhangjiajie', 'Yangshuo', 'Datong', 'Luoyang', 'Sanya', 'Wuhan', 'Xiamen'] },
  { country: 'Thailanda', continent: 'Asia', tier: 1, cities: ['Sukhothai', 'Kanchanaburi', 'Koh Lanta', 'Koh Chang', 'Khao Lak', 'Nan', 'Trang'] },
  { country: 'India', continent: 'Asia', tier: 1, cities: ['Jaisalmer', 'Pushkar', 'Hampi', 'Mysore', 'Darjeeling', 'Shimla', 'Manali', 'Leh', 'Pondicherry', 'Madurai'] },
  { country: 'Statele Unite', continent: 'America de Nord', tier: 3, cities: ['Dallas', 'Houston', 'Phoenix', 'Atlanta', 'Charleston', 'Salt Lake City', 'Minneapolis', 'Detroit', 'Pittsburgh', 'Memphis', 'Key West', 'Santa Fe', 'Palm Springs', 'Sedona', 'Aspen'] },
  { country: 'Canada', continent: 'America de Nord', tier: 2, cities: ['Edmonton', 'Winnipeg', 'Jasper', 'Niagara Falls', 'St. John\'s', 'Kelowna', 'Mont-Tremblant'] },
  { country: 'Mexic', continent: 'America de Nord', tier: 1, cities: ['Monterrey', 'Puebla', 'Guanajuato', 'Cozumel', 'Acapulco', 'Querétaro', 'Mazatlán', 'Isla Mujeres'] },
  { country: 'Brazilia', continent: 'America de Sud', tier: 2, cities: ['Curitiba', 'Belo Horizonte', 'Natal', 'Maceió', 'Porto Alegre', 'Paraty', 'Ilha Grande'] },
  { country: 'Australia', continent: 'Oceania', tier: 3, cities: ['Newcastle', 'Wollongong', 'Geelong', 'Airlie Beach', 'Port Douglas', 'Alice Springs', 'Margaret River', 'Noosa'] },
  { country: 'Maroc', continent: 'Africa', tier: 1, cities: ['Ouarzazate', 'Meknes', 'Asilah', 'El Jadida', 'Ifrane', 'Tinghir'] },
  { country: 'Turcia', continent: 'Europa', tier: 1, cities: ['Trabzon', 'Alanya', 'Side', 'Kas', 'Datça', 'Safranbolu', 'Gaziantep', 'Mardin'] },
  { country: 'Vietnam', continent: 'Asia', tier: 1, cities: ['Can Tho', 'Ninh Binh', 'Mui Ne', 'Hai Phong', 'Vung Tau'] },
  { country: 'Indonezia', continent: 'Asia', tier: 1, cities: ['Labuan Bajo', 'Bromo', 'Raja Ampat', 'Nusa Penida', 'Malang'] },
  { country: 'Filipine', continent: 'Asia', tier: 1, cities: ['Siargao', 'Coron', 'Vigan', 'Baguio', 'Dumaguete'] },
  { country: 'Elveția', continent: 'Europa', tier: 3, cities: ['Gstaad', 'Davos', 'Lauterbrunnen', 'Wengen', 'Locarno', 'Schaffhausen'] },
  { country: 'Austria', continent: 'Europa', tier: 2, cities: ['Zell am See', 'Sölden', 'St. Anton', 'Wachau', 'Mayrhofen'] },
  { country: 'Norvegia', continent: 'Europa', tier: 3, cities: ['Lofoten', 'Geiranger', 'Bodø', 'Kristiansand', 'Narvik'] },
  { country: 'Grecia', continent: 'Europa', tier: 2, cities: ['Sparta', 'Monemvasia', 'Pylos', 'Arachova', 'Metsovo'] },
  { country: 'Georgia', continent: 'Asia', tier: 1, cities: ['Tbilisi', 'Batumi', 'Kazbegi', 'Mtskheta', 'Kutaisi', 'Sighnaghi'] },
  { country: 'Armenia', continent: 'Asia', tier: 1, cities: ['Erevan', 'Dilijan', 'Gyumri'] },
  { country: 'Azerbaidjan', continent: 'Asia', tier: 1, cities: ['Baku', 'Gabala', 'Sheki'] },
  { country: 'Mongolia', continent: 'Asia', tier: 1, cities: ['Ulaanbaatar', 'Kharkhorin'] },
  { country: 'Bangladesh', continent: 'Asia', tier: 1, cities: ['Dhaka', 'Cox\'s Bazar', 'Sylhet'] },
  { country: 'Pakistan', continent: 'Asia', tier: 1, cities: ['Islamabad', 'Lahore', 'Karachi', 'Hunza'] },
  { country: 'Iran', continent: 'Orientul Mijlociu', tier: 1, cities: ['Teheran', 'Isfahan', 'Shiraz', 'Yazd', 'Kashan'] },
  { country: 'Senegal', continent: 'Africa', tier: 1, cities: ['Dakar', 'Saint-Louis'] },
  { country: 'Rwanda', continent: 'Africa', tier: 2, cities: ['Kigali', 'Musanze'] },
  { country: 'Botswana', continent: 'Africa', tier: 2, cities: ['Gaborone', 'Maun', 'Kasane'] },
  { country: 'Zimbabwe', continent: 'Africa', tier: 1, cities: ['Harare', 'Victoria Falls', 'Bulawayo'] },
  { country: 'Uganda', continent: 'Africa', tier: 1, cities: ['Kampala', 'Entebbe'] },
  { country: 'Madagascar', continent: 'Africa', tier: 1, cities: ['Antananarivo', 'Nosy Be'] },
  { country: 'Cabo Verde', continent: 'Africa', tier: 2, cities: ['Praia', 'Sal', 'Boa Vista'] },
  { country: 'Venezuela', continent: 'America de Sud', tier: 1, cities: ['Caracas', 'Mérida', 'Isla Margarita'] },
  { country: 'Paraguay', continent: 'America de Sud', tier: 1, cities: ['Asunción', 'Encarnación'] },
  { country: 'Guyana', continent: 'America de Sud', tier: 1, cities: ['Georgetown'] },
  { country: 'Nicaragua', continent: 'America de Nord', tier: 1, cities: ['Managua', 'Granada', 'San Juan del Sur', 'León'] },
  { country: 'Honduras', continent: 'America de Nord', tier: 1, cities: ['Tegucigalpa', 'Roatán', 'Copán'] },
  { country: 'Belize', continent: 'America de Nord', tier: 2, cities: ['Belize City', 'San Pedro', 'Caye Caulker'] },
  { country: 'Bahamas', continent: 'America de Nord', tier: 3, cities: ['Nassau', 'Freeport', 'Exuma'] },
  { country: 'Barbados', continent: 'America de Nord', tier: 3, cities: ['Bridgetown'] },
  { country: 'Aruba', continent: 'America de Nord', tier: 3, cities: ['Oranjestad'] },
  { country: 'Bosnia și Herțegovina', continent: 'Europa', tier: 1, cities: ['Sarajevo', 'Mostar', 'Banja Luka', 'Trebinje'] },
  { country: 'Macedonia de Nord', continent: 'Europa', tier: 1, cities: ['Skopje', 'Ohrid', 'Bitola'] },
  { country: 'Kosovo', continent: 'Europa', tier: 1, cities: ['Priștina', 'Prizren'] },
  { country: 'Belarus', continent: 'Europa', tier: 1, cities: ['Minsk', 'Brest'] },
  { country: 'Andorra', continent: 'Europa', tier: 2, cities: ['Andorra la Vella'] },
  { country: 'Monaco', continent: 'Europa', tier: 3, cities: ['Monte Carlo'] },
  { country: 'Liechtenstein', continent: 'Europa', tier: 3, cities: ['Vaduz'] },
];

// Construiește lista finală de orașe cu câmpuri derivate (fără duplicate).
const seenIds = new Set<string>();
export const cities: City[] = DATA.flatMap((block) =>
  block.cities.flatMap((name) => {
    const id = `${slug(name)}-${slug(block.country)}`;
    if (seenIds.has(id)) return [];
    seenIds.add(id);
    const h = hash(id);
    return [
      {
        id,
        name,
        country: block.country,
        continent: block.continent,
        image: getCityImage(id, name, block.continent),
        priceTier: block.tier,
        popularity: 55 + (h % 46), // 55-100
      },
    ];
  }),
);

export const totalCities = cities.length;

export const continents: Continent[] = [
  'Europa',
  'Asia',
  'Africa',
  'America de Nord',
  'America de Sud',
  'Oceania',
  'Orientul Mijlociu',
];

export const cityCountries = Array.from(new Set(cities.map((c) => c.country))).sort();

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}
