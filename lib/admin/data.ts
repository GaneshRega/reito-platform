import type {
  TeamMember, Client, ClientUpdate, FollowUp, Home, Match,
  PropertyType, ClientStatus, ClientSource, UpdateType,
} from './types';

// ── Team members ─────────────────────────────────────────────────────────────

export const TEAM: TeamMember[] = [
  { id: 'a1', fullName: 'Anuj Kumar',      initials: 'AK', phone: '+91 98490 11001', email: 'anuj@discover.in',     role: 'super_admin', region: 'All HYD',       status: 'active',   clientsAdded: 6,  clientsAssigned: 8,  conversionRate: 30, avgVerifyDays: 1.2, updatesThisMonth: 14, joinedAt: '2024-01-15' },
  { id: 'a2', fullName: 'Kiran Reddy',     initials: 'KR', phone: '+91 98490 22002', email: 'kiran@discover.in',    role: 'manager',     region: 'All HYD',       status: 'active',   clientsAdded: 9,  clientsAssigned: 12, conversionRate: 35, avgVerifyDays: 1.5, updatesThisMonth: 28, joinedAt: '2024-02-01' },
  { id: 'a3', fullName: 'Arjun Reddy',     initials: 'AR', phone: '+91 97400 33003', email: 'arjun@discover.in',    role: 'agent',       region: 'West HYD',      status: 'active',   clientsAdded: 14, clientsAssigned: 14, conversionRate: 22, avgVerifyDays: 2.1, updatesThisMonth: 41, joinedAt: '2024-03-10' },
  { id: 'a4', fullName: 'Sneha Patel',     initials: 'SP', phone: '+91 96300 44004', email: 'sneha@discover.in',    role: 'agent',       region: 'Central HYD',   status: 'active',   clientsAdded: 11, clientsAssigned: 11, conversionRate: 18, avgVerifyDays: 2.8, updatesThisMonth: 33, joinedAt: '2024-04-05' },
  { id: 'a5', fullName: 'Vijay Kumar',     initials: 'VK', phone: '+91 95200 55005', email: 'vijay.k@discover.in',  role: 'agent',       region: 'East HYD',      status: 'active',   clientsAdded: 7,  clientsAssigned: 7,  conversionRate: 14, avgVerifyDays: 3.4, updatesThisMonth: 19, joinedAt: '2024-05-20' },
  { id: 'a6', fullName: 'Rahul Nair',      initials: 'RN', phone: '+91 94100 66006', email: 'rahul@discover.in',    role: 'agent',       region: 'West HYD',      status: 'active',   clientsAdded: 5,  clientsAssigned: 5,  conversionRate: 20, avgVerifyDays: 2.0, updatesThisMonth: 16, joinedAt: '2024-07-01' },
  { id: 'a7', fullName: 'Preethi Sharma',  initials: 'PS', phone: '+91 93000 77007', email: 'preethi@discover.in',  role: 'agent',       region: 'North HYD',     status: 'active',   clientsAdded: 4,  clientsAssigned: 4,  conversionRate: 25, avgVerifyDays: 1.9, updatesThisMonth: 12, joinedAt: '2024-09-15' },
  { id: 'a8', fullName: 'Vikram Singh',    initials: 'VS', phone: '+91 91900 88008', email: 'vikram@discover.in',   role: 'agent',       region: 'Central HYD',   status: 'active',   clientsAdded: 3,  clientsAssigned: 3,  conversionRate: 10, avgVerifyDays: 4.0, updatesThisMonth: 7,  joinedAt: '2025-01-10' },
  { id: 'a9', fullName: 'Anusha Rao',      initials: 'AU', phone: '+91 90800 99009', email: 'anusha@discover.in',   role: 'agent',       region: 'West HYD',      status: 'inactive', clientsAdded: 8,  clientsAssigned: 0,  conversionRate: 16, avgVerifyDays: 3.1, updatesThisMonth: 0,  joinedAt: '2024-06-01' },
  { id: 'a10',fullName: 'Siddharth Bose',  initials: 'SB', phone: '+91 90700 00010', email: 'siddharth@discover.in',role: 'viewer',      region: 'All HYD',       status: 'active',   clientsAdded: 0,  clientsAssigned: 0,  conversionRate: 0,  avgVerifyDays: 0,   updatesThisMonth: 0,  joinedAt: '2025-06-01' },
];

export function getAgent(id: string): TeamMember | undefined {
  return TEAM.find(a => a.id === id);
}

// ── Helper ────────────────────────────────────────────────────────────────────

let _cid = 0;
function cid() { return `c${String(++_cid).padStart(2, '0')}`; }

function mkClient(
  fullName: string, phone: string, email: string,
  localities: string[], budgetMin: number, budgetMax: number,
  propertyTypes: PropertyType[], bedrooms: number[], timelineMonths: number,
  perks: string[], personalNote: string,
  source: ClientSource, addedById: string, assignedToId: string,
  status: ClientStatus, isVerified: boolean,
  createdAt: string, updatedAt: string,
): Client {
  return {
    id: cid(), fullName, phone, email, localities, budgetMin, budgetMax,
    propertyTypes, bedrooms, timelineMonths, perks, personalNote,
    source, addedById, assignedToId, status, isVerified,
    verifiedById: isVerified ? 'a2' : undefined,
    verifiedAt: isVerified ? updatedAt : undefined,
    createdAt, updatedAt,
  };
}

// ── Clients (50) ─────────────────────────────────────────────────────────────

export const CLIENTS: Client[] = [
  // ── CLOSED_WON (2) ────────────────────────────────────────────────────────
  mkClient('Ravi Kumar Reddy', '+91 99890 12345', 'ravi.reddy@gmail.com', ['Kokapet'], 12000000, 18000000, ['apartment'], [3], 6, ['Gated community','Swimming pool','Gym'], 'IT professional at Infosys. Ready to move. Prefers east facing.', 'web', 'a3', 'a3', 'closed_won', true, '2026-04-10', '2026-07-15'),
  mkClient('Priya Sharma', '+91 98765 43210', 'priya.sharma@outlook.com', ['Jubilee Hills','Banjara Hills'], 40000000, 65000000, ['villa','penthouse'], [4], 3, ['Vastu compliant','Park view','Security'], 'Looking for a quiet corner in Jubilee Hills. Husband is NRI.', 'referral', 'a2', 'a2', 'closed_won', true, '2026-03-20', '2026-07-01'),

  // ── NEGOTIATING (2) ───────────────────────────────────────────────────────
  mkClient('Venkatesh Rao', '+91 97654 32109', 'venkatesh.rao@gmail.com', ['Gachibowli','Madhapur'], 20000000, 32000000, ['apartment'], [3,4], 9, ['Swimming pool','Clubhouse','Lift'], 'Works at Google. Flexible on location within IT corridor.', 'web', 'a4', 'a4', 'negotiating', true, '2026-05-02', '2026-07-28'),
  mkClient('Lakshmi Devi Nair', '+91 96543 21098', 'lakshmi.nair@gmail.com', ['Banjara Hills'], 25000000, 38000000, ['villa'], [3], 6, ['Vastu compliant','North facing','Gated community'], 'Senior doctor at Apollo. Very particular about Vastu.', 'agent', 'a3', 'a3', 'negotiating', true, '2026-05-15', '2026-07-26'),

  // ── OWNER_CONTACTED (3) ───────────────────────────────────────────────────
  mkClient('Srinivas Murthy', '+91 95432 10987', 'srini.murthy@tcs.com', ['Narsingi','Kokapet'], 8000000, 14000000, ['apartment'], [2,3], 12, ['Gated community','Power backup','Car parking'], 'TCS employee. Wife prefers Narsingi for the schools.', 'web', 'a3', 'a3', 'owner_contacted', true, '2026-05-20', '2026-07-22'),
  mkClient('Arun Kumar Reddy', '+91 94321 09876', 'arun.reddy@wipro.com', ['Kondapur','Madhapur'], 15000000, 22000000, ['apartment'], [3], 9, ['Gym','Swimming pool','Clubhouse'], 'Wipro tech lead. Budget confirmed. Very responsive on WhatsApp.', 'agent', 'a4', 'a4', 'owner_contacted', true, '2026-06-01', '2026-07-20'),
  mkClient('Suresh Babu', '+91 93210 98765', 'suresh.babu1970@yahoo.com', ['Kukatpally','Kondapur'], 6000000, 10000000, ['apartment'], [2,3], 18, ['Lift','Power backup','Security','Car parking'], 'Government employee. Savings + home loan. Son studying in BITS.', 'agent', 'a5', 'a5', 'owner_contacted', true, '2026-06-05', '2026-07-18'),

  // ── MATCHED (4) ───────────────────────────────────────────────────────────
  mkClient('Kavitha Menon', '+91 92109 87654', 'kavitha.menon@gmail.com', ['Jubilee Hills'], 35000000, 55000000, ['villa','row_house'], [4], 6, ['Swimming pool','Park view','Children play area'], 'Entrepreneur. Very clear on Jubilee Hills only. No compromise.', 'referral', 'a2', 'a2', 'matched', true, '2026-06-08', '2026-07-17'),
  mkClient('Ramesh Naidu', '+91 91098 76543', 'ramesh.naidu@gmail.com', ['Tellapur','Nallagandla'], 7000000, 11000000, ['apartment'], [3], 15, ['Gated community','Gym','Intercom'], 'Owns a printing business. Looking for self-use. Wife handles shortlisting.', 'web', 'a6', 'a6', 'matched', true, '2026-06-10', '2026-07-16'),
  mkClient('Deepa Krishnan', '+91 90987 65432', 'deepa.krishnan@hdfcbank.com', ['Gachibowli'], 18000000, 27000000, ['apartment','penthouse'], [3], 9, ['Gym','Pool','Open space','East facing'], 'HDFC Bank branch manager. Pre-approved for ₹1.5Cr loan.', 'web', 'a4', 'a4', 'matched', true, '2026-06-12', '2026-07-15'),
  mkClient('Kishore Kumar', '+91 99876 54321', 'kishore.k@amazon.in', ['Kokapet','Narsingi'], 10000000, 17000000, ['apartment'], [3,4], 9, ['Swimming pool','Gated community','Smart home'], 'Amazon SDE-3. Wants to close before relocation.', 'web', 'a3', 'a3', 'matched', true, '2026-06-14', '2026-07-14'),

  // ── PUBLISHED (7) ─────────────────────────────────────────────────────────
  mkClient('Anitha Rao', '+91 98765 12345', 'anitha.rao@gmail.com', ['Banjara Hills','Jubilee Hills'], 30000000, 48000000, ['villa'], [3,4], 9, ['Vastu compliant','Gated community','Swimming pool'], 'Homemaker. Husband is a cardiologist at Care Hospital.', 'referral', 'a2', 'a2', 'published', true, '2026-06-16', '2026-07-13'),
  mkClient('Mahesh Varma', '+91 97654 23456', 'mahesh.varma@infosys.com', ['Madhapur','Kondapur'], 17000000, 28000000, ['apartment'], [3], 12, ['Gym','Pool','Lift','Car parking'], 'Infosys principal engineer. First home buyer.', 'web', 'a4', 'a4', 'published', true, '2026-06-18', '2026-07-12'),
  mkClient('Sunita Devi', '+91 96543 34567', 'sunita.devi@gmail.com', ['Nallagandla','Tellapur'], 6500000, 10000000, ['apartment'], [2,3], 18, ['Power backup','Security','Lift'], 'Teacher at Oakridge. Husband works in pharma sector.', 'agent', 'a5', 'a5', 'published', true, '2026-06-20', '2026-07-11'),
  mkClient('Prasad Gupta', '+91 95432 45678', 'prasad.gupta@microsoft.com', ['Gachibowli','Kondapur'], 22000000, 33000000, ['apartment','penthouse'], [3,4], 9, ['Pool','Gym','Smart home','EV charging'], 'Microsoft PM. Wants smart home features. Remote work setup important.', 'web', 'a4', 'a4', 'published', true, '2026-06-22', '2026-07-10'),
  mkClient('Radhika Iyer', '+91 94321 56789', 'radhika.iyer@gmail.com', ['Jubilee Hills'], 38000000, 60000000, ['villa'], [4], 6, ['Park view','Vastu compliant','Gated community','Security'], 'Retired IAS officer. Downsizing from their current 6BHK.', 'referral', 'a2', 'a2', 'published', true, '2026-06-23', '2026-07-09'),
  mkClient('Vijay Kumar', '+91 93210 67890', 'vijay.kumar88@gmail.com', ['Sainikpuri','Kukatpally'], 5000000, 8500000, ['apartment'], [2,3], 24, ['Power backup','Car parking','Intercom'], 'Army officer. Posting transfers every 2 years. Budget is firm.', 'agent', 'a5', 'a7', 'published', true, '2026-06-24', '2026-07-08'),
  mkClient('Meena Reddy', '+91 92109 78901', 'meena.reddy.hyd@gmail.com', ['Kokapet','Narsingi','Tellapur'], 9000000, 15000000, ['apartment','row_house'], [3], 12, ['Gated community','Children play area','School nearby'], 'Two kids in CBSE school. Husband is a CA. Very patient buyer.', 'web', 'a3', 'a3', 'published', true, '2026-06-25', '2026-07-07'),

  // ── VERIFIED (8) ──────────────────────────────────────────────────────────
  mkClient('Chandra Sekhar Rao', '+91 91098 89012', 'csrao@gmail.com', ['Banjara Hills'], 28000000, 45000000, ['villa','row_house'], [3,4], 9, ['Vastu compliant','North facing','Gated community'], 'Politician. Needs complete privacy. No photos to be shared.', 'agent', 'a2', 'a2', 'verified', true, '2026-06-26', '2026-07-06'),
  mkClient('Pooja Agarwal', '+91 99001 90123', 'pooja.agarwal@gmail.com', ['Gachibowli','Madhapur'], 16000000, 25000000, ['apartment'], [3], 9, ['Gym','Pool','Smart home'], 'Startup founder. Wants a lock-and-leave apartment.', 'web', 'a4', 'a4', 'verified', true, '2026-06-27', '2026-07-05'),
  mkClient('Harish Goud', '+91 98901 01234', 'harish.goud@gmail.com', ['Kondapur','Madhapur','Gachibowli'], 12000000, 20000000, ['apartment'], [2,3], 15, ['Gym','Power backup','Car parking'], 'Mid-level manager at HCL. Home loan pre-sanctioned ₹90L.', 'web', 'a4', 'a4', 'verified', true, '2026-06-28', '2026-07-04'),
  mkClient('Swathi Reddy', '+91 97801 12345', 'swathi.reddy@gmail.com', ['Narsingi','Kokapet'], 7500000, 12500000, ['apartment'], [3], 12, ['Gated community','Swimming pool','Park view'], 'Software engineer at Capgemini. Second home purchase.', 'web', 'a6', 'a6', 'verified', true, '2026-06-29', '2026-07-03'),
  mkClient('Nagaraju Yadav', '+91 96701 23456', 'nraju.yadav@gmail.com', ['Kukatpally'], 4500000, 7500000, ['apartment'], [2], 18, ['Lift','Power backup','Security'], 'Auto-entrepreneur. Wife is a home science teacher.', 'agent', 'a5', 'a5', 'verified', true, '2026-06-30', '2026-07-02'),
  mkClient('Bhavani Devi', '+91 95601 34567', 'bhavani.devi@gmail.com', ['Sainikpuri'], 4000000, 6500000, ['apartment'], [2,3], 24, ['Power backup','Car parking','Children play area'], 'Primary school teacher. Long timeline but serious buyer.', 'agent', 'a7', 'a7', 'verified', true, '2026-07-01', '2026-07-01'),
  mkClient('Sunil Kumar', '+91 94501 45678', 'sunil.kumar.hyd@gmail.com', ['Tellapur','Nallagandla'], 8500000, 14000000, ['apartment','row_house'], [3], 12, ['Gated community','Gym','Open space'], 'Pharma sector. Wife is radiologist at Yashoda.', 'web', 'a3', 'a3', 'verified', true, '2026-07-02', '2026-07-02'),
  mkClient('Divyashree Rao', '+91 93401 56789', 'divya.rao.re@gmail.com', ['Jubilee Hills','Banjara Hills'], 32000000, 52000000, ['villa'], [4], 6, ['Vastu compliant','Swimming pool','Security','Garden'], 'NRI returning. Wants villa before child starts school.', 'referral', 'a2', 'a2', 'verified', true, '2026-07-03', '2026-07-03'),

  // ── CONTACTED (10) ────────────────────────────────────────────────────────
  mkClient('Manohar Reddy', '+91 92301 67890', 'manohar.reddy@gmail.com', ['Gachibowli'], 18000000, 26000000, ['apartment'], [3], 12, ['Pool','Gym'], 'Tech lead at Deloitte. Prefers a higher floor.', 'web', 'a4', 'a4', 'contacted', false, '2026-07-04', '2026-07-10'),
  mkClient('Padmavathi Nair', '+91 91201 78901', 'padmavathi.nair@gmail.com', ['Banjara Hills','Jubilee Hills'], 29000000, 42000000, ['villa'], [4], 9, ['Vastu compliant','Gated community','Car parking'], 'Joint family purchase. Decision made by extended family council.', 'referral', 'a2', 'a2', 'contacted', false, '2026-07-05', '2026-07-11'),
  mkClient('Rajesh Kumar', '+91 99101 89012', 'rajesh.kumar2@gmail.com', ['Madhapur','Kondapur'], 14000000, 22000000, ['apartment'], [3], 9, ['Gym','Pool','Smart home'], 'Senior dev at Accenture. Very data-driven buyer.', 'web', 'a4', 'a4', 'contacted', false, '2026-07-06', '2026-07-12'),
  mkClient('Shilpa Agarwal', '+91 97001 90123', 'shilpa.agarwal@gmail.com', ['Kokapet'], 9500000, 15000000, ['apartment'], [3], 12, ['Swimming pool','Gated community','Gym'], 'Works in pharma marketing. Husband is also in IT.', 'web', 'a3', 'a3', 'contacted', false, '2026-07-07', '2026-07-13'),
  mkClient('Gopal Krishnan', '+91 95901 01234', 'gopal.krishnan@gmail.com', ['Narsingi','Tellapur'], 7000000, 11500000, ['apartment','row_house'], [3], 15, ['Gated community','Power backup','Children play area'], 'Bank employee. HDFC pre-approval in process.', 'agent', 'a5', 'a5', 'contacted', false, '2026-07-08', '2026-07-14'),
  mkClient('Usha Rani', '+91 94801 12345', 'usha.rani.hyd@gmail.com', ['Kukatpally','Kondapur'], 5500000, 9000000, ['apartment'], [2,3], 18, ['Lift','Security','Car parking'], 'Government nurse at NIMS. Considering joint home loan with brother.', 'agent', 'a5', 'a5', 'contacted', false, '2026-07-09', '2026-07-15'),
  mkClient('Karthik Raju', '+91 93701 23456', 'karthik.raju@gmail.com', ['Gachibowli','Madhapur'], 16000000, 24000000, ['apartment'], [2,3], 9, ['Pool','Smart home','EV charging'], 'Founder at fintech startup. Renting currently in Gachibowli.', 'web', 'a4', 'a6', 'contacted', false, '2026-07-10', '2026-07-16'),
  mkClient('Nandini Sharma', '+91 92601 34567', 'nandini.sharma@gmail.com', ['Jubilee Hills'], 42000000, 70000000, ['villa','penthouse'], [4], 6, ['Private pool','Security','Garden'], 'Daughter buying for parents who are currently abroad.', 'referral', 'a2', 'a2', 'contacted', false, '2026-07-11', '2026-07-17'),
  mkClient('Ashok Kumar', '+91 91501 45678', 'ashok.kumar3@gmail.com', ['Nallagandla'], 7500000, 13000000, ['apartment'], [3], 15, ['Gated community','Gym','Open space'], 'Civil engineer. Building knowledge. Asks many questions about construction quality.', 'web', 'a3', 'a3', 'contacted', false, '2026-07-12', '2026-07-18'),
  mkClient('Savitha Menon', '+91 99501 56789', 'savitha.menon@gmail.com', ['Banjara Hills'], 24000000, 36000000, ['villa'], [3], 9, ['Vastu compliant','North facing','Swimming pool'], 'Gynaecologist at Rainbow Hospital. Very busy, prefers weekend calls.', 'referral', 'a2', 'a2', 'contacted', false, '2026-07-13', '2026-07-19'),

  // ── NEW (14) ──────────────────────────────────────────────────────────────
  mkClient('Ramu Yadav', '+91 98401 67890', 'ramu.yadav.hyd@gmail.com', ['Kukatpally'], 4000000, 7000000, ['apartment'], [2], 24, ['Lift','Security'], 'Rickshaw business owner. First home. Needs guidance.', 'agent', 'a5', 'a5', 'new', false, '2026-07-15', '2026-07-15'),
  mkClient('Ananya Reddy', '+91 97301 78901', 'ananya.reddy21@gmail.com', ['Madhapur','Gachibowli'], 12000000, 19000000, ['apartment'], [2,3], 12, ['Pool','Gym','Smart home'], 'Product manager at a unicorn startup. Single buyer.', 'web', 'a4', 'a4', 'new', false, '2026-07-15', '2026-07-15'),
  mkClient('Balakrishna Goud', '+91 96201 89012', 'bala.goud@gmail.com', ['Narsingi','Kokapet'], 8000000, 13000000, ['apartment'], [3], 15, ['Gated community','Children play area','School nearby'], 'Construction materials dealer. Wife wants to be near Oakridge school.', 'agent', 'a3', 'a3', 'new', false, '2026-07-16', '2026-07-16'),
  mkClient('Sirisha Kumari', '+91 95101 90123', 'sirisha.kumari@gmail.com', ['Banjara Hills','Jubilee Hills'], 33000000, 50000000, ['villa','row_house'], [3,4], 6, ['Vastu compliant','Gated community','Pool'], 'Interior designer. Has very specific aesthetic requirements.', 'referral', 'a2', 'a2', 'new', false, '2026-07-16', '2026-07-16'),
  mkClient('Ganesh Prasad', '+91 94001 01234', 'ganesh.prasad@gmail.com', ['Kondapur','Madhapur'], 13000000, 20000000, ['apartment'], [3], 12, ['Gym','Power backup','Car parking'], 'Quality manager at a pharma MNC. Home loan approved ₹80L.', 'web', 'a4', 'a4', 'new', false, '2026-07-17', '2026-07-17'),
  mkClient('Madhuri Devi', '+91 92901 12345', 'madhuri.devi.hyd@gmail.com', ['Tellapur','Nallagandla'], 6000000, 10000000, ['apartment'], [2,3], 18, ['Gated community','Power backup','Lift'], 'Housewife. Husband is a truck fleet owner. Kids in CBSE.', 'agent', 'a6', 'a6', 'new', false, '2026-07-17', '2026-07-17'),
  mkClient('Satish Chander', '+91 91801 23456', 'satish.chander@gmail.com', ['Sainikpuri'], 4500000, 7000000, ['apartment'], [2,3], 24, ['Power backup','Security','Lift'], 'CRPF officer. Retiring in 2 years. Planning ahead.', 'web', 'a7', 'a7', 'new', false, '2026-07-18', '2026-07-18'),
  mkClient('Kavya Sharma', '+91 99301 34567', 'kavya.sharma97@gmail.com', ['Gachibowli'], 13000000, 20000000, ['apartment'], [2], 9, ['Smart home','Gym','Pool','EV charging'], 'Google SWE. Very techie. Wants smart home integration.', 'web', 'a4', 'a4', 'new', false, '2026-07-18', '2026-07-18'),
  mkClient('Pavan Kumar', '+91 98201 45678', 'pavan.kumar.hyd@gmail.com', ['Kokapet','Narsingi'], 9000000, 15000000, ['apartment'], [3], 12, ['Gated community','Pool','Gym'], 'Mid-level IT manager. Budget just increased after promotion.', 'web', 'a3', 'a3', 'new', false, '2026-07-19', '2026-07-19'),
  mkClient('Rekha Nair', '+91 97101 56789', 'rekha.nair@gmail.com', ['Banjara Hills'], 26000000, 40000000, ['villa'], [3,4], 9, ['Vastu compliant','Swimming pool','Garden'], 'Chartered accountant. Tax planning drives the timeline.', 'referral', 'a2', 'a2', 'new', false, '2026-07-20', '2026-07-20'),
  mkClient('Nagendra Babu', '+91 96001 67890', 'nagendra.babu@gmail.com', ['Kondapur','Gachibowli'], 14000000, 22000000, ['apartment'], [3], 12, ['Pool','Gym','Clubhouse'], 'Senior analyst at Deloitte. Moving from Pune.', 'web', 'a4', 'a4', 'new', false, '2026-07-20', '2026-07-20'),
  mkClient('Sushma Rao', '+91 94901 78901', 'sushma.rao@gmail.com', ['Jubilee Hills'], 36000000, 58000000, ['villa'], [4], 6, ['Private pool','Vastu compliant','Security','Garden'], 'Husband runs a jewellery chain. Moving to bigger home.', 'referral', 'a2', 'a2', 'new', false, '2026-07-21', '2026-07-21'),
  mkClient('Dinesh Kumar', '+91 93801 89012', 'dinesh.kumar.del@gmail.com', ['Madhapur','Kondapur'], 15000000, 23000000, ['apartment'], [3], 9, ['Pool','Gym','Smart home'], 'Transferred from Delhi office. Company pays housing allowance.', 'web', 'a8', 'a8', 'new', false, '2026-07-22', '2026-07-22'),
  mkClient('Lalitha Kumari', '+91 92701 90123', 'lalitha.kumari@gmail.com', ['Nallagandla'], 7000000, 11000000, ['apartment','row_house'], [3], 15, ['Gated community','Open space','Children play area'], 'Elementary school teacher. Husband is a mechanic.', 'agent', 'a5', 'a5', 'new', false, '2026-07-22', '2026-07-22'),

  // ── CLOSED_LOST (1) + DROPPED (1) ────────────────────────────────────────
  mkClient('Rohit Mehta', '+91 91601 01234', 'rohit.mehta@gmail.com', ['Gachibowli'], 14000000, 20000000, ['apartment'], [3], 9, ['Pool','Gym'], 'Bought from another platform. Budget was accurate but couldn\'t wait.', 'web', 'a4', 'a4', 'closed_lost', true, '2026-05-01', '2026-07-01'),
  mkClient('Snehal Deshpande', '+91 90501 12345', 'snehal.desh@gmail.com', ['Kondapur'], 11000000, 17000000, ['apartment'], [3], 12, ['Pool','Gym','Car parking'], 'Lead went cold after first call. Number no longer reachable.', 'web', 'a4', 'a4', 'dropped', false, '2026-05-10', '2026-06-15'),
];

// ── Timeline updates (curated for key clients) ────────────────────────────────

export const CLIENT_UPDATES: ClientUpdate[] = [
  // c01 – Ravi Kumar Reddy (closed_won)
  { id: 'u01', clientId: 'c01', type: 'system',       body: 'CIF submitted via website.',                                                                                         authorId: undefined,  createdAt: '2026-04-10T09:00:00Z' },
  { id: 'u02', clientId: 'c01', type: 'call',          body: 'Called Ravi — confirmed ₹1.2–1.8Cr range and east-facing preference. Very decisive.',                               authorId: 'a3',       createdAt: '2026-04-11T11:30:00Z' },
  { id: 'u03', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'new', nextStatus: 'contacted',                                                                       authorId: 'a3',       createdAt: '2026-04-11T11:31:00Z' },
  { id: 'u04', clientId: 'c01', type: 'whatsapp',      body: 'Sent verification checklist on WhatsApp. He replied in 10 min.',                                                    authorId: 'a3',       createdAt: '2026-04-12T14:00:00Z' },
  { id: 'u05', clientId: 'c01', type: 'note',          body: 'Documents received: Aadhaar + last 3 months Infosys payslips. IT professional, salary ~₹3.2L/month.',              authorId: 'a3',       createdAt: '2026-04-14T10:15:00Z' },
  { id: 'u06', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'contacted', nextStatus: 'verified',                                                                  authorId: 'a2',       createdAt: '2026-04-15T09:00:00Z' },
  { id: 'u07', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'verified', nextStatus: 'published',                                                                  authorId: 'a2',       createdAt: '2026-04-16T10:00:00Z' },
  { id: 'u08', clientId: 'c01', type: 'system',        body: 'Profile matched to 3 homes in Kokapet.',                                                                             authorId: undefined,  createdAt: '2026-04-18T08:00:00Z' },
  { id: 'u09', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'published', nextStatus: 'matched',                                                                   authorId: 'a2',       createdAt: '2026-04-18T08:01:00Z' },
  { id: 'u10', clientId: 'c01', type: 'meeting',       body: 'Site visit at Kokapet Rise — 3BHK on 7th floor. Ravi and wife both liked it. Good vibes.',                         authorId: 'a3',       createdAt: '2026-04-25T11:00:00Z' },
  { id: 'u11', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'matched', nextStatus: 'owner_contacted',                                                             authorId: 'a3',       createdAt: '2026-04-26T09:00:00Z' },
  { id: 'u12', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'owner_contacted', nextStatus: 'negotiating',                                                         authorId: 'a3',       createdAt: '2026-05-10T10:00:00Z' },
  { id: 'u13', clientId: 'c01', type: 'call',          body: 'Price negotiated down to ₹1.42Cr from ₹1.5Cr. Stamp duty to be split 50/50. Token advance paid ₹2L.',             authorId: 'a3',       createdAt: '2026-06-02T16:00:00Z' },
  { id: 'u14', clientId: 'c01', type: 'status_change', body: '', prevStatus: 'negotiating', nextStatus: 'closed_won',                                                              authorId: 'a2',       createdAt: '2026-07-15T12:00:00Z' },

  // c03 – Venkatesh Rao (negotiating)
  { id: 'u20', clientId: 'c03', type: 'system',        body: 'CIF submitted via website.',                                                                                         authorId: undefined,  createdAt: '2026-05-02T08:00:00Z' },
  { id: 'u21', clientId: 'c03', type: 'call',          body: 'Called Venkat — works at Google GPLEX. Looking for 3 or 4BHK. Flexible on exact locality.',                        authorId: 'a4',       createdAt: '2026-05-03T10:00:00Z' },
  { id: 'u22', clientId: 'c03', type: 'status_change', body: '', prevStatus: 'new', nextStatus: 'contacted',                                                                       authorId: 'a4',       createdAt: '2026-05-03T10:01:00Z' },
  { id: 'u23', clientId: 'c03', type: 'note',          body: 'Salary ₹4.2L/month confirmed. Company housing allowance ₹75k. Pre-sanctioned for ₹1.6Cr loan from ICICI.',        authorId: 'a4',       createdAt: '2026-05-07T11:30:00Z' },
  { id: 'u24', clientId: 'c03', type: 'status_change', body: '', prevStatus: 'contacted', nextStatus: 'verified',                                                                  authorId: 'a2',       createdAt: '2026-05-10T09:00:00Z' },
  { id: 'u25', clientId: 'c03', type: 'status_change', body: '', prevStatus: 'verified', nextStatus: 'published',                                                                  authorId: 'a2',       createdAt: '2026-05-12T10:00:00Z' },
  { id: 'u26', clientId: 'c03', type: 'system',        body: 'Profile matched to 5 homes across Gachibowli and Madhapur.',                                                        authorId: undefined,  createdAt: '2026-05-14T08:00:00Z' },
  { id: 'u27', clientId: 'c03', type: 'status_change', body: '', prevStatus: 'published', nextStatus: 'owner_contacted',                                                           authorId: 'a4',       createdAt: '2026-06-01T09:00:00Z' },
  { id: 'u28', clientId: 'c03', type: 'site_visit',    body: 'Visited The Prestige Gachibowli — 4BHK, 2800sqft. Liked the view. Owner met us in person.',                        authorId: 'a4',       createdAt: '2026-06-10T11:00:00Z' },
  { id: 'u29', clientId: 'c03', type: 'status_change', body: '', prevStatus: 'owner_contacted', nextStatus: 'negotiating',                                                         authorId: 'a4',       createdAt: '2026-07-01T09:00:00Z' },
  { id: 'u30', clientId: 'c03', type: 'call',          body: 'Owner quoted ₹3.1Cr. Venkat comfortable at ₹2.85Cr. Gap is ₹25L. Discussing car park inclusion.',                  authorId: 'a4',       createdAt: '2026-07-20T14:00:00Z' },

  // c07 – Kavitha Menon (matched)
  { id: 'u40', clientId: 'c07', type: 'system',        body: 'Referred by Priya Sharma (c02), existing DISCOVER client.',                                                         authorId: undefined,  createdAt: '2026-06-08T08:00:00Z' },
  { id: 'u41', clientId: 'c07', type: 'call',          body: 'First call — Kavitha very specific about Jubilee Hills only. Has seen 6 properties last 4 months via brokers.', authorId: 'a2',       createdAt: '2026-06-08T12:00:00Z' },
  { id: 'u42', clientId: 'c07', type: 'status_change', body: '', prevStatus: 'new', nextStatus: 'contacted',                                                                       authorId: 'a2',       createdAt: '2026-06-08T12:01:00Z' },
  { id: 'u43', clientId: 'c07', type: 'whatsapp',      body: 'Sent her our Jubilee Hills owner report. She replied: "Finally a platform that gets it."',                          authorId: 'a2',       createdAt: '2026-06-09T10:00:00Z' },
  { id: 'u44', clientId: 'c07', type: 'status_change', body: '', prevStatus: 'contacted', nextStatus: 'verified',                                                                  authorId: 'a2',       createdAt: '2026-06-11T09:00:00Z' },
  { id: 'u45', clientId: 'c07', type: 'status_change', body: '', prevStatus: 'verified', nextStatus: 'published',                                                                  authorId: 'a2',       createdAt: '2026-06-12T10:00:00Z' },
  { id: 'u46', clientId: 'c07', type: 'system',        body: 'Profile matched to 2 villas in Jubilee Hills (scores: 0.94, 0.88).',                                               authorId: undefined,  createdAt: '2026-06-15T08:00:00Z' },
  { id: 'u47', clientId: 'c07', type: 'status_change', body: '', prevStatus: 'published', nextStatus: 'matched',                                                                   authorId: 'a2',       createdAt: '2026-06-17T09:00:00Z' },
  { id: 'u48', clientId: 'c07', type: 'note',          body: 'Owner of the 4BHK on Road No. 12 is interested. Notified them. Awaiting callback window.',                         authorId: 'a2',       createdAt: '2026-07-10T11:00:00Z' },

  // c09 – Deepa Krishnan (matched)
  { id: 'u50', clientId: 'c09', type: 'system',        body: 'CIF submitted via website.',                                                                                         authorId: undefined,  createdAt: '2026-06-12T08:00:00Z' },
  { id: 'u51', clientId: 'c09', type: 'call',          body: 'Deepa is HDFC branch manager. Pre-approved loan ₹1.5Cr. Wants to close Q3.',                                       authorId: 'a4',       createdAt: '2026-06-13T10:00:00Z' },
  { id: 'u52', clientId: 'c09', type: 'status_change', body: '', prevStatus: 'new', nextStatus: 'contacted',                                                                       authorId: 'a4',       createdAt: '2026-06-13T10:01:00Z' },
  { id: 'u53', clientId: 'c09', type: 'status_change', body: '', prevStatus: 'contacted', nextStatus: 'verified',                                                                  authorId: 'a2',       createdAt: '2026-06-16T09:00:00Z' },
  { id: 'u54', clientId: 'c09', type: 'status_change', body: '', prevStatus: 'verified', nextStatus: 'published',                                                                  authorId: 'a2',       createdAt: '2026-06-17T10:00:00Z' },
  { id: 'u55', clientId: 'c09', type: 'system',        body: 'Profile matched to 4 apartments in Gachibowli (scores: 0.91, 0.87, 0.83, 0.72).',                                 authorId: undefined,  createdAt: '2026-06-20T08:00:00Z' },
  { id: 'u56', clientId: 'c09', type: 'status_change', body: '', prevStatus: 'published', nextStatus: 'matched',                                                                   authorId: 'a2',       createdAt: '2026-06-22T09:00:00Z' },
];

// ── Follow-ups ────────────────────────────────────────────────────────────────

export const FOLLOW_UPS: FollowUp[] = [
  { id: 'f01', clientId: 'c03', title: 'Follow up on price gap negotiation', dueAt: '2026-08-03T10:00:00Z', assignedToId: 'a4', createdBy: 'a4', createdAt: '2026-07-28T09:00:00Z' },
  { id: 'f02', clientId: 'c05', title: 'Owner meeting confirmation — call at 6pm', dueAt: '2026-08-02T18:00:00Z', assignedToId: 'a3', createdBy: 'a3', createdAt: '2026-07-30T10:00:00Z' },
  { id: 'f03', clientId: 'c07', title: 'Check if Road No.12 owner responded', dueAt: '2026-08-01T11:00:00Z', assignedToId: 'a2', createdBy: 'a2', createdAt: '2026-07-25T10:00:00Z' },
  { id: 'f04', clientId: 'c13', title: 'Weekend call — she prefers Sat morning', dueAt: '2026-08-02T10:00:00Z', assignedToId: 'a4', createdBy: 'a4', createdAt: '2026-07-29T14:00:00Z' },
  { id: 'f05', clientId: 'c22', title: 'Share Kokapet options shortlist', dueAt: '2026-07-31T14:00:00Z', assignedToId: 'a3', createdBy: 'a3', createdAt: '2026-07-28T16:00:00Z' },
  { id: 'f06', clientId: 'c18', title: 'Call re: Jubilee Hills — check decision timing', dueAt: '2026-07-30T11:00:00Z', assignedToId: 'a2', createdBy: 'a2', createdAt: '2026-07-27T09:00:00Z' },
  { id: 'f07', clientId: 'c14', title: 'Send Banjara Hills comparison doc', dueAt: '2026-07-29T15:00:00Z', assignedToId: 'a2', completedAt: '2026-07-29T14:45:00Z', createdBy: 'a2', createdAt: '2026-07-27T10:00:00Z' },
  { id: 'f08', clientId: 'c28', title: 'Verify documents — HDFC pre-sanction letter', dueAt: '2026-07-30T10:00:00Z', assignedToId: 'a5', createdBy: 'a5', createdAt: '2026-07-28T11:00:00Z' },
];

// ── Homes (20 claimed properties) ────────────────────────────────────────────

export const HOMES: Home[] = [
  { id: 'h01', ownerName: 'Shekhar Goud',      ownerPhone: '+91 98000 11111', ownerEmail: 'shekhar@gmail.com',  locality: 'Kokapet',      address: 'Kokapet Rise, Block B, Flat 704',  propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1820, priceAsking: 14500000, floor: 7,  totalFloors: 14, facing: 'East',  ageYears: 2,  furnishing: 'semi_furnished',  amenities: ['Pool','Gym','Club','Power backup'],            description: 'Spacious 3BHK in premium gated community. East facing, morning sun.',         status: 'approved',  listingStatus: 'in_deal',   dealClientId: 'c10', handledById: 'a2', addedById: 'a3', matchedClientCount: 4, submittedVia: 'web',   createdAt: '2026-04-15', updatedAt: '2026-04-18' },
  { id: 'h02', ownerName: 'Radha Krishnaswamy', ownerPhone: '+91 97000 22222', ownerEmail: undefined,            locality: 'Jubilee Hills', address: 'Road No. 12, Jubilee Hills',       propertyType: 'villa',     bedrooms: 4, bathrooms: 4, areaSqft: 4200, priceAsking: 55000000, floor: undefined, totalFloors: undefined, facing: 'North', ageYears: 8,  furnishing: 'fully_furnished', amenities: ['Private garden','Security','Car parking x3'],  description: 'Classic Jubilee Hills villa. Tree-lined road. Quiet.',                        status: 'approved',  listingStatus: 'in_deal',   dealClientId: 'c07', handledById: 'a2', addedById: 'a2', matchedClientCount: 2, submittedVia: 'agent', createdAt: '2026-05-01', updatedAt: '2026-05-05' },
  { id: 'h03', ownerName: 'Praveen Varma',      ownerPhone: '+91 96000 33333', ownerEmail: 'praveen@email.com',  locality: 'Gachibowli',   address: 'Prestige Gachibowli, Tower 3, 12F', propertyType: 'apartment', bedrooms: 4, bathrooms: 3, areaSqft: 2800, priceAsking: 31000000, floor: 12, totalFloors: 24, facing: 'South', ageYears: 3,  furnishing: 'semi_furnished',  amenities: ['Pool','Gym','Concierge','EV charging'],        description: 'High floor premium flat, city views, well maintained.',                       status: 'approved',  listingStatus: 'in_deal',   dealClientId: 'c03', handledById: 'a4', addedById: 'a4', matchedClientCount: 5, submittedVia: 'web',   createdAt: '2026-05-10', updatedAt: '2026-05-14' },
  { id: 'h04', ownerName: 'Venu Gopal',         ownerPhone: '+91 95000 44444', ownerEmail: undefined,            locality: 'Banjara Hills', address: 'Road No. 36, Banjara Hills',       propertyType: 'villa',     bedrooms: 3, bathrooms: 3, areaSqft: 3100, priceAsking: 42000000, floor: undefined, totalFloors: undefined, facing: 'East',  ageYears: 5,  furnishing: 'unfurnished',     amenities: ['Garden','Vastu','Gated'],                      description: 'Vastu-compliant villa. Recently renovated interiors.',                       status: 'approved',  listingStatus: 'available', handledById: 'a3', addedById: 'a3', matchedClientCount: 3, submittedVia: 'agent', createdAt: '2026-05-20', updatedAt: '2026-05-24' },
  { id: 'h05', ownerName: 'Sujatha Nair',       ownerPhone: '+91 94000 55555', ownerEmail: 'sujatha@gmail.com', locality: 'Narsingi',      address: 'My Home Narsingi, Block A',        propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1650, priceAsking: 10500000, floor: 4,  totalFloors: 10, facing: 'West',  ageYears: 1,  furnishing: 'unfurnished',     amenities: ['Pool','Gym','Power backup','Children play area'], description: 'New construction, OC in hand. Near International school.',                   status: 'approved',  listingStatus: 'sold',      dealClientId: 'c01', handledById: 'a3', addedById: 'a3', matchedClientCount: 6, submittedVia: 'web',   createdAt: '2026-06-01', updatedAt: '2026-06-05' },
  { id: 'h06', ownerName: 'Murali Krishna',     ownerPhone: '+91 93000 66666', ownerEmail: undefined,            locality: 'Madhapur',      address: 'Madhapur HITEC Layout, Plot 42',   propertyType: 'plot',      bedrooms: 0, bathrooms: 0, areaSqft: 267,  priceAsking: 9000000,  floor: undefined, totalFloors: undefined, facing: 'North', ageYears: 0,  furnishing: undefined,         amenities: ['Corner plot','GHMC approved'],                 description: '267 sqyd GHMC-approved plot, corner. Clean title.',                          status: 'approved',  listingStatus: 'available', handledById: 'a4', addedById: 'a4', matchedClientCount: 2, submittedVia: 'agent', createdAt: '2026-06-10', updatedAt: '2026-06-14' },
  { id: 'h07', ownerName: 'Aruna Devi',         ownerPhone: '+91 92000 77777', ownerEmail: 'aruna.devi@yahoo.in',locality: 'Kondapur',      address: 'Kondapur Main Road, Lake View Apts',propertyType: 'apartment', bedrooms: 2, bathrooms: 2, areaSqft: 1250, priceAsking: 8200000,  floor: 3,  totalFloors: 6,  facing: 'East',  ageYears: 9,  furnishing: 'semi_furnished',  amenities: ['Lift','Power backup','Car parking'],           description: 'Well-maintained older flat. Water tank issues resolved.',                    status: 'approved',  listingStatus: 'available', handledById: 'a4', addedById: 'a4', matchedClientCount: 3, submittedVia: 'web',   createdAt: '2026-06-15', updatedAt: '2026-06-18' },
  { id: 'h08', ownerName: 'Ramana Goud',        ownerPhone: '+91 91000 88888', ownerEmail: undefined,            locality: 'Nallagandla',   address: 'Nallagandla Township, Phase 2',    propertyType: 'row_house', bedrooms: 3, bathrooms: 3, areaSqft: 2100, priceAsking: 12500000, floor: undefined, totalFloors: 3,  facing: 'East',  ageYears: 4,  furnishing: 'semi_furnished',  amenities: ['Gated','Garden','Power backup'],               description: 'Independent row house, small private garden, quiet lane.',                   status: 'approved',  listingStatus: 'available', handledById: 'a3', addedById: 'a3', matchedClientCount: 2, submittedVia: 'agent', createdAt: '2026-06-20', updatedAt: '2026-06-24' },
  { id: 'h09', ownerName: 'Keshava Rao',        ownerPhone: '+91 99900 99999', ownerEmail: 'keshava@gmail.com', locality: 'Tellapur',      address: 'Tellapur Enclave, Unit C-201',     propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1580, priceAsking: 9800000,  floor: 2,  totalFloors: 8,  facing: 'North', ageYears: 2,  furnishing: 'unfurnished',     amenities: ['Pool','Security','Intercom'],                  description: 'New community, Phase 2. Adjacent to ORR exit.',                             status: 'approved',  listingStatus: 'reserved',  handledById: 'a6', addedById: 'a6', matchedClientCount: 4, submittedVia: 'web',   createdAt: '2026-06-25', updatedAt: '2026-06-28' },
  { id: 'h10', ownerName: 'Indira Sharma',      ownerPhone: '+91 98800 10101', ownerEmail: undefined,            locality: 'Kukatpally',    address: 'Kukatpally KPHB Colony, Plot 18',  propertyType: 'apartment', bedrooms: 2, bathrooms: 2, areaSqft: 1080, priceAsking: 5800000,  floor: 5,  totalFloors: 10, facing: 'West',  ageYears: 12, furnishing: 'semi_furnished',  amenities: ['Lift','Security','Car parking'],               description: 'Established colony. Well connected to Metro.',                               status: 'approved',  listingStatus: 'available', handledById: 'a5', addedById: 'a5', matchedClientCount: 1, submittedVia: 'web',   createdAt: '2026-06-28', updatedAt: '2026-07-01' },
  // Pending / review queue
  { id: 'h11', ownerName: 'Subramaniam K.',     ownerPhone: '+91 97700 11211', ownerEmail: undefined,            locality: 'Gachibowli',   address: 'DLF Cybercity Road',               propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1900, priceAsking: 22000000, floor: 9,  totalFloors: 18, facing: 'East',  ageYears: 4,  furnishing: undefined,         amenities: ['Pool','Gym','Club'],                           description: 'Owner moving abroad. Motivated to sell.',                                    status: 'pending',   listingStatus: 'off_market', handledById: undefined, addedById: undefined, submittedVia: 'web', createdAt: '2026-07-25', updatedAt: '2026-07-25' },
  { id: 'h12', ownerName: 'Madhusudhan Rao',    ownerPhone: '+91 96600 12312', ownerEmail: 'madhu@gmail.com',   locality: 'Banjara Hills', address: 'Banjara Hills Rd No. 45',          propertyType: 'villa',     bedrooms: 4, bathrooms: 4, areaSqft: 3800, priceAsking: 48000000, floor: undefined, totalFloors: 2,  facing: 'North', ageYears: 6,  furnishing: undefined,         amenities: ['Pool','Garden','Security'],                    description: 'Corner plot villa, 2 floors. Recently painted exterior.',                    status: 'pending',   listingStatus: 'off_market', handledById: 'a2', addedById: 'a2', submittedVia: 'agent', createdAt: '2026-07-26', updatedAt: '2026-07-26' },
  { id: 'h13', ownerName: 'Padma Lakshmi',      ownerPhone: '+91 95500 13413', ownerEmail: undefined,            locality: 'Kokapet',      address: 'Kokapet Habitat, A Block',         propertyType: 'apartment', bedrooms: 2, bathrooms: 2, areaSqft: 1350, priceAsking: 11000000, floor: 6,  totalFloors: 12, facing: 'East',  ageYears: 3,  furnishing: undefined,         amenities: ['Pool','Gym','Gated'],                          description: 'Compact 2BHK, east facing, well lit all morning.',                          status: 'more_info_requested', listingStatus: 'off_market', handledById: 'a3', addedById: 'a3', submittedVia: 'web', createdAt: '2026-07-24', updatedAt: '2026-07-27' },
  { id: 'h14', ownerName: 'Sateesh Reddy',      ownerPhone: '+91 94400 14514', ownerEmail: 'sateesh.reddy@gmail.com', locality: 'Narsingi', address: 'Narsingi Greens, Plot B2',      propertyType: 'row_house', bedrooms: 3, bathrooms: 3, areaSqft: 1950, priceAsking: 13500000, floor: undefined, totalFloors: 3,  facing: 'East',  ageYears: 2,  furnishing: undefined,         amenities: ['Gated','Garden','Power backup'],               description: 'Under warranty period. All appliances included.',                            status: 'pending',   listingStatus: 'off_market', handledById: undefined, addedById: undefined, submittedVia: 'web', createdAt: '2026-07-27', updatedAt: '2026-07-27' },
  { id: 'h15', ownerName: 'Vijayalakshmi',      ownerPhone: '+91 93300 15615', ownerEmail: undefined,            locality: 'Kondapur',      address: 'Kondapur Hi-Life Residency',       propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1700, priceAsking: 16000000, floor: 8,  totalFloors: 16, facing: 'West',  ageYears: 5,  furnishing: undefined,         amenities: ['Pool','Gym','Lift','Power backup'],            description: 'West-facing but good cross ventilation. Well-run society.',                  status: 'rejected',  listingStatus: 'off_market', handledById: 'a4', addedById: 'a4', adminNote: 'Owner could not produce EC beyond 2019. Rejected pending legal clearance.', submittedVia: 'web', createdAt: '2026-07-18', updatedAt: '2026-07-22' },
  { id: 'h16', ownerName: 'Chandramohan',       ownerPhone: '+91 92200 16716', ownerEmail: undefined,            locality: 'Sainikpuri',    address: 'Sainikpuri Main Road, Flat 302',   propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1420, priceAsking: 6200000,  floor: 3,  totalFloors: 7,  facing: 'East',  ageYears: 15, furnishing: undefined,         amenities: ['Security','Lift','Car parking'],               description: 'Older building, recently repainted. Lift newly installed.',                  status: 'pending',   listingStatus: 'off_market', handledById: undefined, addedById: undefined, submittedVia: 'web', createdAt: '2026-07-28', updatedAt: '2026-07-28' },
  { id: 'h17', ownerName: 'Geetha Kumari',      ownerPhone: '+91 91100 17817', ownerEmail: 'geetha.k@gmail.com', locality: 'Madhapur',     address: 'Madhapur HITEC City, Floor 14',    propertyType: 'penthouse', bedrooms: 4, bathrooms: 4, areaSqft: 3500, priceAsking: 62000000, floor: 14, totalFloors: 14, facing: 'East',  ageYears: 6,  furnishing: undefined,         amenities: ['Private terrace','Pool','Concierge'],          description: 'Penthouse with private rooftop terrace. Panoramic HITEC City view.',        status: 'pending',   listingStatus: 'off_market', handledById: 'a4', addedById: 'a4', submittedVia: 'agent', createdAt: '2026-07-29', updatedAt: '2026-07-29' },
  { id: 'h18', ownerName: 'RamReddy',           ownerPhone: '+91 99100 18918', ownerEmail: undefined,            locality: 'Nallagandla',   address: 'Nallagandla ORR Road, Apt 401',    propertyType: 'apartment', bedrooms: 3, bathrooms: 2, areaSqft: 1680, priceAsking: 12000000, floor: 4,  totalFloors: 10, facing: 'North', ageYears: 3,  furnishing: undefined,         amenities: ['Gated','Pool','Power backup'],                 description: 'Newly registered. OC received last month.',                                  status: 'more_info_requested', listingStatus: 'off_market', handledById: 'a3', addedById: 'a3', submittedVia: 'web', createdAt: '2026-07-23', updatedAt: '2026-07-26' },
  { id: 'h19', ownerName: 'Satyanarayana P.',   ownerPhone: '+91 98000 19019', ownerEmail: 'satyan@gmail.com',  locality: 'Gachibowli',   address: 'Gachibowli Sports Complex Road',   propertyType: 'apartment', bedrooms: 2, bathrooms: 2, areaSqft: 1150, priceAsking: 14000000, floor: 11, totalFloors: 22, facing: 'East',  ageYears: 7,  furnishing: undefined,         amenities: ['Gym','Pool','Concierge'],                      description: 'Premium high-rise. Original owner, never rented.',                          status: 'pending',   listingStatus: 'off_market', handledById: undefined, addedById: undefined, submittedVia: 'web', createdAt: '2026-07-29', updatedAt: '2026-07-29' },
  { id: 'h20', ownerName: 'Bhagya Reddy',       ownerPhone: '+91 97000 20120', ownerEmail: undefined,            locality: 'Kondapur',      address: 'Kondapur Manjeera Trinity',        propertyType: 'apartment', bedrooms: 3, bathrooms: 3, areaSqft: 2000, priceAsking: 18500000, floor: 6,  totalFloors: 12, facing: 'East',  ageYears: 4,  furnishing: undefined,         amenities: ['Pool','Gym','Club','Security'],                 description: 'Large 3BHK with servant quarters. East facing.',                            status: 'pending',   listingStatus: 'off_market', handledById: 'a4', addedById: 'a4', submittedVia: 'agent', createdAt: '2026-07-30', updatedAt: '2026-07-30' },
];

// ── Matches ───────────────────────────────────────────────────────────────────

export const MATCHES: Match[] = [
  { id: 'm01', clientId: 'c07', homeId: 'h02', score: 0.94, isPinned: true,  isExcluded: false, createdAt: '2026-06-15T08:00:00Z' },
  { id: 'm02', clientId: 'c07', homeId: 'h04', score: 0.88, isPinned: false, isExcluded: false, createdAt: '2026-06-15T08:01:00Z' },
  { id: 'm03', clientId: 'c09', homeId: 'h03', score: 0.91, isPinned: true,  isExcluded: false, createdAt: '2026-06-20T08:00:00Z' },
  { id: 'm04', clientId: 'c09', homeId: 'h06', score: 0.87, isPinned: false, isExcluded: false, createdAt: '2026-06-20T08:01:00Z' },
  { id: 'm05', clientId: 'c09', homeId: 'h07', score: 0.83, isPinned: false, isExcluded: false, createdAt: '2026-06-20T08:02:00Z' },
  { id: 'm06', clientId: 'c10', homeId: 'h01', score: 0.89, isPinned: true,  isExcluded: false, createdAt: '2026-06-28T08:00:00Z' },
  { id: 'm07', clientId: 'c10', homeId: 'h05', score: 0.82, isPinned: false, isExcluded: false, createdAt: '2026-06-28T08:01:00Z' },
  { id: 'm08', clientId: 'c08', homeId: 'h08', score: 0.86, isPinned: false, isExcluded: false, createdAt: '2026-06-25T08:00:00Z' },
  { id: 'm09', clientId: 'c08', homeId: 'h09', score: 0.79, isPinned: false, isExcluded: false, createdAt: '2026-06-25T08:01:00Z' },
];

// ── Derived helpers ───────────────────────────────────────────────────────────

export function getClientUpdates(clientId: string): ClientUpdate[] {
  return CLIENT_UPDATES.filter(u => u.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getClientFollowUps(clientId: string): FollowUp[] {
  return FOLLOW_UPS.filter(f => f.clientId === clientId);
}

export function getClientMatches(clientId: string): Array<Match & { home: Home }> {
  return MATCHES
    .filter(m => m.clientId === clientId)
    .map(m => ({ ...m, home: HOMES.find(h => h.id === m.homeId)! }))
    .filter(m => m.home)
    .sort((a, b) => b.score - a.score);
}

// ── Chart data (7/30/90-day submission timelines) ─────────────────────────────

function makeWeekly(base: number[]): number[] { return base; }

export const CHART_DATA = {
  '7d': makeWeekly([3,5,2,7,4,6,5]),
  '30d': Array.from({ length: 30 }, (_, i) => Math.max(0, Math.round(2.5 + Math.sin(i * 0.6) * 2 + Math.random() * 1.5))),
  '90d': Array.from({ length: 90 }, (_, i) => Math.max(0, Math.round(2 + i * 0.035 + Math.sin(i * 0.3) * 2))),
};

export const LOCALITIES_DEMAND = [
  { name: 'Gachibowli',    clients: 11, homes: 3 },
  { name: 'Kokapet',       clients: 9,  homes: 3 },
  { name: 'Banjara Hills', clients: 8,  homes: 3 },
  { name: 'Madhapur',      clients: 8,  homes: 2 },
  { name: 'Kondapur',      clients: 7,  homes: 3 },
  { name: 'Jubilee Hills', clients: 7,  homes: 1 },
  { name: 'Narsingi',      clients: 6,  homes: 2 },
  { name: 'Nallagandla',   clients: 5,  homes: 2 },
  { name: 'Kukatpally',    clients: 4,  homes: 1 },
  { name: 'Tellapur',      clients: 4,  homes: 1 },
  { name: 'Sainikpuri',    clients: 3,  homes: 1 },
];
