// DISCOVER — Real Hyderabad villa project listings
// 115 projects from primary market research (South, West, North-West, South-West, North zones).
// Coordinates: approximate locality centroids with per-project jitter.
// Images: Unsplash placeholders (replace with real project images when available).

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Independent House"
  | "Builder Floor"
  | "Penthouse"
  | "Plot";

export type ListingStatus = "For Sale" | "New Launch" | "Under Construction" | "Ready to Move";

export type Furnishing = "Unfurnished" | "Semi-furnished" | "Fully furnished";

export interface Agent {
  name: string;
  phone: string;
  email: string;
  agency: string;
  avatar: string;
}

export interface Listing {
  id: string;
  title: string;
  address: string;
  locality: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  price: number;
  pricePerSqft: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: PropertyType;
  status: ListingStatus;
  furnishing: Furnishing;
  facing: string;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number;
  parking: number;
  description: string;
  amenities: string[];
  images: string[];
  agent: Agent;
  listedDate: string;
  featured: boolean;
}

/* ── Agents ─────────────────────────────────────────────────────────────────── */

const agentPool: Record<string, Agent> = {
  rajesh: { name: "Rajesh Varma",  phone: "+91 98490 21134", email: "rajesh@discover.in", agency: "Discover Premium",     avatar: "" },
  sneha:  { name: "Sneha Reddy",   phone: "+91 99590 44821", email: "sneha@discover.in",  agency: "Discover Premium",     avatar: "" },
  imran:  { name: "Imran Qureshi", phone: "+91 90005 77310", email: "imran@discover.in",  agency: "Discover Residential", avatar: "" },
  divya:  { name: "Divya Prasad",  phone: "+91 91777 30256", email: "divya@discover.in",  agency: "Discover Residential", avatar: "" },
};
const AGENT_KEYS = ["rajesh", "sneha", "imran", "divya"] as const;

/* ── Placeholder images (Unsplash villas) ───────────────────────────────────── */

const IMGS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
  "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&q=80",
  "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80",
  "https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&q=80",
];

/* ── Amenity pool ───────────────────────────────────────────────────────────── */

const AMENITY_POOL = [
  "Clubhouse", "Swimming pool", "Gymnasium", "Gated community",
  "24/7 security", "Power backup", "CCTV", "Rainwater harvesting",
  "Landscaped gardens", "Children's play area", "Jogging track",
  "Tennis court", "Multipurpose hall", "EV charging",
];

/* ── Locality coordinates (approx. centroids) ───────────────────────────────── */

const COORDS: Record<string, [number, number]> = {
  "Pedda Golkonda":       [17.3205, 78.4195],
  "Raviryala":            [17.2860, 78.5240],
  "Adibatla":             [17.2780, 78.5720],
  "Maheswaram":           [17.2120, 78.4560],
  "Thummalur":            [17.2640, 78.5340],
  "Harshaguda":           [17.2480, 78.5610],
  "Manakhal":             [17.2370, 78.5820],
  "Mamidipally":          [17.2260, 78.4410],
  "Tukkuguda":            [17.2740, 78.5130],
  "Basaguda":             [17.2820, 78.5520],
  "Gaganapahed":          [17.2560, 78.5030],
  "Gollur":               [17.2890, 78.4830],
  "Immamguda":            [17.2440, 78.4960],
  "Shamshabad":           [17.2450, 78.4310],
  "Kardanur":             [17.4110, 78.2310],
  "Tellapur":             [17.4920, 78.2840],
  "Patiganpur":           [17.4230, 78.2140],
  "Shankarpally":         [17.4510, 78.1940],
  "Kollur":               [17.4730, 78.2520],
  "Pati":                 [17.4320, 78.2240],
  "Mokila":               [17.4640, 78.2420],
  "Velimala":             [17.4370, 78.2170],
  "Osman Nagar":          [17.4060, 78.2920],
  "Mehtab Khan Gudem":    [17.4430, 78.2340],
  "Gopanpally":           [17.4310, 78.3120],
  "Nallagandla":          [17.4830, 78.3130],
  "Kokapet":              [17.4050, 78.3280],
  "Kondapur":             [17.4620, 78.3650],
  "Manchirevula":         [17.3760, 78.3420],
  "Gandipet":             [17.3910, 78.3440],
  "Patancheruvu":         [17.5360, 78.2660],
  "Isnapur":              [17.5560, 78.2810],
  "Beeramguda":           [17.5460, 78.2370],
  "Bandlaguda Jagir":     [17.3440, 78.4130],
  "TSPA Junction":        [17.3360, 78.3820],
  "Bandlaguda":           [17.3380, 78.4120],
  "Attapur":              [17.3640, 78.4230],
  "Golconda":             [17.3830, 78.4020],
  "Budvel":               [17.3160, 78.4360],
  "Rajendra Nagar":       [17.3410, 78.4310],
  "Kismatpur":            [17.2920, 78.4620],
  "Shamirpet":            [17.5880, 78.5130],
  "Dundigal":             [17.6120, 78.4660],
  "Pudur-Kompally":       [17.5460, 78.4910],
  "Kompally":             [17.5410, 78.4860],
  "Gowdavelli-Kompally":  [17.5530, 78.4930],
  "Pudur-Medchal":        [17.5510, 78.5120],
  "Kandlakoya-Medchal":   [17.5720, 78.5210],
};

/* ── Pincodes ───────────────────────────────────────────────────────────────── */

const PINCODES: Record<string, string> = {
  "Pedda Golkonda": "500028",  "Raviryala": "500052",       "Adibatla": "501510",
  "Maheswaram": "500082",      "Thummalur": "500052",        "Harshaguda": "501510",
  "Manakhal": "501510",        "Mamidipally": "501218",      "Tukkuguda": "501218",
  "Basaguda": "500079",        "Gaganapahed": "500079",      "Gollur": "500028",
  "Immamguda": "500028",       "Shamshabad": "501218",       "Kardanur": "502319",
  "Tellapur": "502032",        "Patiganpur": "502319",       "Shankarpally": "501203",
  "Kollur": "502019",          "Pati": "502319",             "Mokila": "501359",
  "Velimala": "501359",        "Osman Nagar": "502032",      "Mehtab Khan Gudem": "502319",
  "Gopanpally": "500019",      "Nallagandla": "500019",      "Kokapet": "500075",
  "Kondapur": "500084",        "Manchirevula": "500089",     "Gandipet": "500075",
  "Patancheruvu": "502319",    "Isnapur": "502270",          "Beeramguda": "502032",
  "Bandlaguda Jagir": "500086","TSPA Junction": "500086",    "Bandlaguda": "500086",
  "Attapur": "500048",         "Golconda": "500008",         "Budvel": "500086",
  "Rajendra Nagar": "500052",  "Kismatpur": "500086",        "Shamirpet": "500078",
  "Dundigal": "500043",        "Pudur-Kompally": "500014",   "Kompally": "500014",
  "Gowdavelli-Kompally": "500014", "Pudur-Medchal": "501401","Kandlakoya-Medchal": "501401",
};

const FACINGS = ["East", "North", "West", "South", "North-East", "South-East", "North-West", "South-West"];
const MONTHS  = ["04", "05", "06", "07", "08"];

/* ── Locality normalizer ─────────────────────────────────────────────────────── */

function resolveLocality(raw: string): string {
  if (raw.includes("Thukkuguda") || raw.includes("Tukkuguda")) return "Tukkuguda";
  if (raw.includes("Adhibatla") || raw.includes("Adibatla"))   return "Adibatla";
  if (raw.includes("Raviryal"))                                 return "Raviryala";
  if (raw.includes("Gopanpally"))                               return "Gopanpally";
  if (raw.includes("Rajendra Nagar"))                           return "Rajendra Nagar";
  if (raw.includes("Patancheruv"))                              return "Patancheruvu";
  if (raw.includes("Pudur-Kompally"))                           return "Pudur-Kompally";
  if (raw.includes("Gowdavelli"))                               return "Gowdavelli-Kompally";
  if (raw.includes("Pudur-Medchal"))                            return "Pudur-Medchal";
  if (raw.includes("Kandlakoya"))                               return "Kandlakoya-Medchal";
  return raw.split(",")[0].trim();
}

/* ── Listing factory ─────────────────────────────────────────────────────────── */

function mkVilla(
  sno: number,
  name: string,
  rawLoc: string,
  beds: number,
  ppsf: number | null,     // price per sq ft; null → use crTotal
  crTotal: number | null,  // total price in Crores; null → use ppsf
  stage: "rtm" | "uc" | "launch",
  yr: number,
  featured = false,
): Listing {
  const locality  = resolveLocality(rawLoc);
  const coords    = COORDS[locality] ?? [17.42, 78.38];
  const sqft      = beds <= 3 ? 2800 : beds === 4 ? 3500 : beds === 5 ? 4500 : 5500;
  const pricePsf  = ppsf ?? Math.round((crTotal! * 10_000_000) / sqft);
  const price     = ppsf ? ppsf * sqft : Math.round(crTotal! * 10_000_000);
  const jLat      = ((sno * 7 + 3) % 15 - 7) * 0.0004;
  const jLng      = ((sno * 11 + 5) % 15 - 7) * 0.0004;
  const yearBuilt = stage === "rtm" ? (yr || 2024) : yr;

  const statusMap: Record<string, ListingStatus> = {
    rtm: "Ready to Move", uc: "Under Construction", launch: "New Launch",
  };

  const amenities = AMENITY_POOL.filter((_, i) => (i + sno) % 9 !== 0).slice(0, 8);
  const imgA = IMGS[(sno - 1) % IMGS.length];
  const imgB = IMGS[(sno + 7)  % IMGS.length];

  const stageDesc =
    stage === "rtm"    ? "Ready to move in with occupancy certificate received." :
    stage === "launch" ? `Pre-launch opportunity — expected handover ${yr}.` :
                         `Under construction — expected handover ${yr}.`;

  return {
    id: `v-${String(sno).padStart(3, "0")}`,
    title: `${name} — ${beds}BHK+HT Villa`,
    address: `${name}, ${locality}, Hyderabad`,
    locality,
    city: "Hyderabad",
    pincode: PINCODES[locality] ?? "500001",
    lat: coords[0] + jLat,
    lng: coords[1] + jLng,
    price,
    pricePerSqft: pricePsf,
    beds,
    baths: beds,
    sqft,
    propertyType: "Villa",
    status: statusMap[stage],
    furnishing: "Unfurnished",
    facing: FACINGS[sno % FACINGS.length],
    floor: null,
    totalFloors: 3,
    yearBuilt,
    parking: 2,
    description: `${name} is a luxury ${beds}BHK+Home Theatre villa project in ${locality}, Hyderabad. ${stageDesc} Premium gated community with clubhouse, swimming pool, gymnasium, and landscaped gardens.`,
    amenities,
    images: [imgA, imgB],
    agent: agentPool[AGENT_KEYS[sno % 4]],
    listedDate: `2026-${MONTHS[sno % 5]}-${String(((sno * 7) % 28) + 1).padStart(2, "0")}`,
    featured,
  };
}

/* ── Listings ────────────────────────────────────────────────────────────────── */

export const listings: Listing[] = [
  // ── SOUTH ZONE (1–44) ────────────────────────────────────────────────────────
  mkVilla( 1, "Issara Belmond",          "Pedda Golkonda", 4, 14000, null,  "uc",     2026, true),
  mkVilla( 2, "Sark South Meadows",      "Raviryala",      3,  9500, null,  "rtm",    2024),
  mkVilla( 3, "Ace Apurva",              "Adibatla",       3,  8500, null,  "rtm",    2024),
  mkVilla( 4, "Hallmark Oakshir",        "Maheswaram",     3,  7999, null,  "rtm",    2025),
  mkVilla( 5, "Illika",                  "Adibatla",       4,  8000, null,  "uc",     2029),
  mkVilla( 6, "Autumn",                  "Thummalur",      3,  6499, null,  "uc",     2028),
  mkVilla( 7, "Vashnavi Elite",          "Adibatla",       4,  8000, null,  "uc",     2027),
  mkVilla( 8, "Globus",                  "Harshaguda",     4,  5400, null,  "uc",     2028),
  mkVilla( 9, "Globus Manakhal",         "Manakhal",       3,  6400, null,  "uc",     2028),
  mkVilla(10, "Gruppe Elara",            "Raviryala",      4,  9500, null,  "uc",     2028),
  mkVilla(11, "Aryama",                  "Adibatla",       4,  8500, null,  "uc",     2029),
  mkVilla(12, "Western Park",            "Mamidipally",    4, 10000, null,  "rtm",    2024),
  mkVilla(13, "IRA Square",              "Adibatla",       4,  9000, null,  "uc",     2026),
  mkVilla(14, "IRA Urban Ranch",         "Adibatla",       4,  9500, null,  "uc",     2028),
  mkVilla(15, "Vishal Sanjeevni",        "Tukkuguda",      5, 11500, null,  "rtm",    2024),
  mkVilla(16, "Velora",                  "Tukkuguda",      4,  9999, null,  "uc",     2027),
  mkVilla(17, "GHR Trivana",             "Tukkuguda",      4, 10000, null,  "uc",     2028),
  mkVilla(18, "Habitat",                 "Tukkuguda",      4,  9500, null,  "uc",     2029),
  mkVilla(19, "Identity Villas",         "Adibatla",       4, 11000, null,  "uc",     2029),
  mkVilla(20, "Nest Makers",             "Basaguda",       4,  9500, null,  "uc",     2028),
  mkVilla(21, "Casagrand Vybe",          "Gaganapahed",    4,  null,  4.30, "uc",     2029),
  mkVilla(22, "Lacasa by E-Infra",       "Raviryala",      4,  9500, null,  "rtm",    2024),
  mkVilla(23, "Artha",                   "Adibatla",       4,  8500, null,  "uc",     2029),
  mkVilla(24, "Speed Constella",         "Tukkuguda",      4, 10500, null,  "rtm",    2025),
  mkVilla(25, "Casagrand Windsor Court", "Tukkuguda",      4,  null,  4.50, "uc",     2027),
  mkVilla(26, "Vertex Calysta",          "Tukkuguda",      3, 12000, null,  "uc",     2029),
  mkVilla(27, "Fiora",                   "Tukkuguda",      4, 10000, null,  "uc",     2028),
  mkVilla(28, "Identity Astha",          "Tukkuguda",      4, 11000, null,  "uc",     2027),
  mkVilla(29, "Issara Venizia",          "Tukkuguda",      4, 12000, null,  "uc",     2030),
  mkVilla(30, "Vaishnoi Southwoods",     "Mamidipally",    4, 13000, null,  "rtm",    2025),
  mkVilla(31, "Arkala The Reserve",      "Tukkuguda",      4, 13000, null,  "uc",     2030),
  mkVilla(32, "The Pointe",              "Gollur",         4, 12500, null,  "rtm",    2025),
  mkVilla(33, "Altila",                  "Immamguda",      4, 12500, null,  "uc",     2028),
  mkVilla(34, "Natures Edge",            "Tukkuguda",      4, 13000, null,  "uc",     2027),
  mkVilla(35, "Vertex Florenza",         "Tukkuguda",      4, 12500, null,  "uc",     2027),
  mkVilla(36, "Bridge Epsillion",        "Tukkuguda",      4, 13250, null,  "uc",     2027),
  mkVilla(37, "Lios",                    "Tukkuguda",      4, 12000, null,  "uc",     2028),
  mkVilla(38, "Keerthi Azure",           "Tukkuguda",      5, 12000, null,  "uc",     2029),
  mkVilla(39, "Whispering Woods",        "Shamshabad",     5, 14000, null,  "uc",     2029, true),
  mkVilla(40, "Ramky Reserve",           "Harshaguda",     5, 15000, null,  "uc",     2028, true),
  mkVilla(41, "IRA Elevate",             "Shamshabad",     4,  null, 10.00, "uc",     2026),
  mkVilla(42, "The Valley",              "Pedda Golkonda", 4, 18000, null,  "uc",     2027, true),
  mkVilla(43, "EIPL Treasure Trove",     "Maheswaram",     4, 14000, null,  "uc",     2027),
  mkVilla(44, "IRA Float",               "Shamshabad",     4,  null, 20.00, "uc",     2028),

  // ── WEST ZONE (45–89) ────────────────────────────────────────────────────────
  mkVilla(45, "Myra Eloria",             "Kardanur",            4,  8500, null,  "uc",     2029),
  mkVilla(46, "Anmol Aurm",              "Kardanur",            4,  9000, null,  "uc",     2029),
  mkVilla(47, "Anmol Aalaya",            "Kardanur",            4,  9000, null,  "uc",     2029),
  mkVilla(48, "Surabhi Signature",       "Tellapur",            3, 13000, null,  "rtm",    2024),
  mkVilla(49, "Shiva Sai Myra",          "Patiganpur",          3, 10000, null,  "rtm",    2024),
  mkVilla(50, "Ramky Shankarpally",      "Shankarpally",        4,  9000, null,  "launch", 2029),
  mkVilla(51, "R R Zenora",              "Kollur",              4, 11000, null,  "uc",     2029),
  mkVilla(52, "Ankura IQON West",        "Shankarpally",        4, 11000, null,  "rtm",    2025),
  mkVilla(53, "APR Praveens Eterno",     "Kollur",              4, 10000, null,  "rtm",    2024),
  mkVilla(54, "Hallmark Nature Nest",    "Pati",                3, 13000, null,  "uc",     2027),
  mkVilla(55, "Hallmark Floresta",       "Kollur",              3, 13000, null,  "uc",     2026),
  mkVilla(56, "Infocity Villas",         "Patiganpur",          4, 10200, null,  "uc",     2027),
  mkVilla(57, "Sridhaam Villas",         "Mokila",              4, 11000, null,  "uc",     2029),
  mkVilla(58, "Hallmark Westlyn",        "Kollur",              4, 11000, null,  "uc",     2030),
  mkVilla(59, "Elegans Emperio",         "Kollur",              4, 13000, null,  "rtm",    2024),
  mkVilla(60, "Reliance La Valora",      "Kardanur",            4, 11500, null,  "uc",     2029),
  mkVilla(61, "Bhavya Evora",            "Velimala",            4, 12300, null,  "rtm",    2024),
  mkVilla(62, "Raichandani Orchid",      "Mokila",              4,  9600, null,  "uc",     2026),
  mkVilla(63, "Kakathiya Mango Leaf",    "Osman Nagar",         4, 16000, null,  "rtm",    2024),
  mkVilla(64, "TAG Patio",               "Mokila",              5, 12500, null,  "uc",     2027),
  mkVilla(65, "TAG Santorini",           "Mokila",              5, 11500, null,  "uc",     2027),
  mkVilla(66, "Srivari Meadows",         "Mokila",              4, 13000, null,  "rtm",    2024),
  mkVilla(67, "S Square Urban Greens",   "Kollur",              3, 13000, null,  "rtm",    2024),
  mkVilla(68, "Anukura Konak",           "Mehtab Khan Gudem",   4,  null,  5.00, "uc",     2027),
  mkVilla(69, "Suvasa by Elegans",       "Velimala",            4, 15000, null,  "uc",     2029),
  mkVilla(70, "Bella Vista",             "Tellapur",            4, 15500, null,  "rtm",    2024),
  mkVilla(71, "Halcyon Homes",           "Tellapur",            4, 18500, null,  "rtm",    2024),
  mkVilla(72, "Keerthi Verdure",         "Pati",                4, 14000, null,  "uc",     2029),
  mkVilla(73, "Raadhey Raaga",           "Kollur",              4, 18500, null,  "rtm",    2024),
  mkVilla(74, "Muppa Indraprastha",      "Gopanpally",          4, 18000, null,  "rtm",    2024),
  mkVilla(75, "Hallmark County",         "Gopanpally",          4, 20000, null,  "rtm",    2024, true),
  mkVilla(76, "Navanami",                "Kollur",              5, 15000, null,  "launch", 2030),
  mkVilla(77, "Nivee Gardens",           "Tellapur",            4, 24000, null,  "rtm",    2024),
  mkVilla(78, "Northstar Allura",        "Kokapet",             4, 19500, null,  "rtm",    2024, true),
  mkVilla(79, "Sage by Raghava",         "Kollur",              5, 17500, null,  "uc",     2026),
  mkVilla(80, "Vertex Kingston Park",    "Nallagandla",         4, 22000, null,  "uc",     2027),
  mkVilla(81, "Majestic Villas",         "Kollur",              5, 16000, null,  "uc",     2028),
  mkVilla(82, "Supadha Geethika",        "Velimala",            5, 21000, null,  "rtm",    2024),
  mkVilla(83, "Hallmark Imperia",        "Gopanpally",          5, 25000, null,  "rtm",    2024),
  mkVilla(84, "E-Infra Celosia",         "Osman Nagar",         4, 18000, null,  "uc",     2028),
  mkVilla(85, "Bluefin Sylvanor",        "Mokila",              5, 21000, null,  "uc",     2027),
  mkVilla(86, "Aikaa Sri Aditya",        "Gandipet",            5, 23000, null,  "uc",     2026),
  mkVilla(87, "Hidden Cove Sri Aditya",  "Manchirevula",        5, 27500, null,  "uc",     2027),
  mkVilla(88, "Aaranya Terminus",        "Gandipet",            5, 30000, null,  "uc",     2028, true),
  mkVilla(89, "Kolla Luxuria",           "Kondapur",            4, 18000, null,  "rtm",    2024),

  // ── NORTH-WEST ZONE (91–94) ───────────────────────────────────────────────────
  mkVilla(91, "Elemental",               "Patancheruvu",        3,  8500, null,  "uc",     2029),
  mkVilla(92, "Sansa County",            "Patancheruvu",        3,  8500, null,  "rtm",    2024),
  mkVilla(93, "My Casa",                 "Isnapur",             3,  7700, null,  "uc",     2029),
  mkVilla(94, "Ask Infra",               "Beeramguda",          3,  7000, null,  "uc",     2029),

  // ── SOUTH-WEST ZONE (97–105) ──────────────────────────────────────────────────
  mkVilla( 97, "Riverscape",             "Bandlaguda Jagir",    4, 14000, null,  "rtm",    2024),
  mkVilla( 98, "Keerthi Sanctuary",      "TSPA Junction",       4, 16500, null,  "uc",     2026, true),
  mkVilla( 99, "Keerthi Riverside",      "TSPA Junction",       4, 16500, null,  "rtm",    2024),
  mkVilla(100, "Casa Carino",            "Bandlaguda",          4, 18000, null,  "rtm",    2024),
  mkVilla(101, "Dev Signature",          "Attapur",             4, 14500, null,  "rtm",    2024),
  mkVilla(102, "Tattvam",                "Golconda",            4, 18500, null,  "uc",     2027),
  mkVilla(103, "Pranava Greenwich",      "Budvel",              4, 12500, null,  "uc",     2026),
  mkVilla(104, "Oorjitha Armonia",       "Rajendra Nagar",      5, 22000, null,  "rtm",    2024),
  mkVilla(105, "Giridhara Prospera",     "Kismatpur",           4, 20000, null,  "rtm",    2024),

  // ── NORTH ZONE (106–114) ─────────────────────────────────────────────────────
  mkVilla(106, "Prajy Tree Trops",       "Shamirpet",           3,  7000, null,  "rtm",    2024),
  mkVilla(107, "Casagrand Sierra",       "Dundigal",            3,  null,  2.30, "uc",     2029),
  mkVilla(108, "Raichandani Futnani",    "Shamirpet",           4,  7500, null,  "rtm",    2024),
  mkVilla(109, "Krishe Avya",            "Pudur-Kompally",      4,  9500, null,  "uc",     2028),
  mkVilla(110, "Indis Myra",             "Kompally",            3,  null,  4.00, "uc",     2026),
  mkVilla(111, "Belair",                 "Gowdavelli-Kompally", 3,  null,  4.00, "uc",     2026),
  mkVilla(112, "Crest Wood",             "Pudur-Medchal",       3,  null,  4.00, "uc",     2027),
  mkVilla(113, "Casagrand Monaco",       "Kandlakoya-Medchal",  5,  null,  5.00, "uc",     2029),
  mkVilla(114, "Elegance Sreyan",        "Kompally",            3, 13000, null,  "uc",     2027),

  // ── EXTRA PROJECT (from additional data) ─────────────────────────────────────
  mkVilla(115, "Bhavya Aspire Spaces",   "Kardanur",            4,  9500, null,  "uc",     2029),
];

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

/** ₹1.45Cr / ₹82L / ₹9,600 — Indian short-form currency */
export function formatINR(rupees: number): string {
  if (rupees >= 10_000_000) {
    const cr = rupees / 10_000_000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/0$/, "")}Cr`;
  }
  if (rupees >= 100_000) {
    const lakh = rupees / 100_000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(1)}L`;
  }
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/** "₹8,100/sqft" */
export function formatPerSqft(value: number): string {
  return `₹${value.toLocaleString("en-IN")}/sqft`;
}

export const localities      = [...new Set(listings.map((l) => l.locality))].sort();
export const propertyTypes   = [...new Set(listings.map((l) => l.propertyType))].sort() as PropertyType[];
export const featuredListings = listings.filter((l) => l.featured);

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

/** Map bounds covering all listings — for Leaflet fitBounds on load */
export const cityBounds: [[number, number], [number, number]] = [
  [17.21, 78.19],
  [17.62, 78.58],
];

export const cityCenter: [number, number] = [17.42, 78.38];
