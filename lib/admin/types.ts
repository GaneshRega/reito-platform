export type UserRole = 'super_admin' | 'manager' | 'agent' | 'viewer';
export type ClientSource = 'web' | 'agent' | 'referral';
export type PropertyType =
  | 'apartment' | 'villa' | 'plot' | 'penthouse'
  | 'farmhouse' | 'studio' | 'row_house' | 'duplex';
export type ClientStatus =
  | 'new' | 'contacted' | 'verified' | 'published'
  | 'matched' | 'owner_contacted' | 'negotiating'
  | 'closed_won' | 'closed_lost' | 'dropped';
export type HomeStatus = 'pending' | 'more_info_requested' | 'approved' | 'rejected';
export type ListingStatus = 'available' | 'in_deal' | 'reserved' | 'sold' | 'off_market';
export type UpdateType =
  | 'call' | 'meeting' | 'site_visit' | 'email' | 'whatsapp'
  | 'note' | 'status_change' | 'reassignment' | 'system';

export interface TeamMember {
  id: string;
  fullName: string;
  initials: string;
  phone: string;
  email: string;
  role: UserRole;
  region: string;
  status: 'active' | 'inactive';
  clientsAdded: number;
  clientsAssigned: number;
  conversionRate: number;
  avgVerifyDays: number;
  updatesThisMonth: number;
  joinedAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email: string;
  occupation?: string;
  company?: string;
  currentCity?: string;
  officeLocation?: string;
  localities: string[];
  budgetMin: number;
  budgetMax: number;
  propertyTypes: PropertyType[];
  bedrooms: number[];
  areaSqftMin?: number;
  areaSqftMax?: number;
  timelineMonths: number;
  perks: string[];
  facing?: string[];
  vastuRequired?: boolean;
  purpose?: 'end_use' | 'investment' | 'rental' | 'nri';
  paymentMode?: 'cash' | 'loan' | 'mixed';
  loanRequired?: boolean;
  loanBank?: string;
  loanAmount?: number;
  downPayment?: number;
  emiComfort?: number;
  commMode?: string[];
  callTime?: string;
  familyApproval?: string;
  visitedProjects?: string;
  painPoints?: string[];
  personalNote: string;
  source: ClientSource;
  addedById: string;
  assignedToId: string;
  status: ClientStatus;
  isVerified: boolean;
  verifiedById?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientUpdate {
  id: string;
  clientId: string;
  type: UpdateType;
  body: string;
  prevStatus?: ClientStatus;
  nextStatus?: ClientStatus;
  prevAgentId?: string;
  nextAgentId?: string;
  authorId?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  clientId: string;
  title: string;
  dueAt: string;
  assignedToId: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface Home {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  locality: string;
  societyName?: string;
  address: string;
  reraNumber?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  plotSqyd?: number;
  priceAsking: number;
  floor?: number;
  totalFloors?: number;
  facing?: string;
  ageYears?: number;
  furnishing?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  parkingSlots?: number;
  waterSource?: string;
  ownerOccupied?: boolean;
  amenities: string[];
  highlights?: string;
  description?: string;
  status: HomeStatus;
  listingStatus: ListingStatus;
  dealClientId?: string;
  handledById?: string;
  addedById?: string;
  adminNote?: string;
  submittedVia: 'web' | 'agent';
  matchedClientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  clientId: string;
  homeId: string;
  score: number;
  isPinned: boolean;
  isExcluded: boolean;
  createdAt: string;
}

export const STATUS_META: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  new:             { label: 'New',             color: '#5C554C', bg: '#F0EDE8' },
  contacted:       { label: 'Contacted',        color: '#2A6EBB', bg: '#E5EEF8' },
  verified:        { label: 'Verified',         color: '#A8863E', bg: '#F5EDD4' },
  published:       { label: 'Published',        color: '#1D7D5A', bg: '#E0F2EB' },
  matched:         { label: 'Matched',          color: '#6B4CA6', bg: '#EDE6F8' },
  owner_contacted: { label: 'Owner Contacted',  color: '#B05B15', bg: '#FAE9D8' },
  negotiating:     { label: 'Negotiating',      color: '#8A6D00', bg: '#F7EFC0' },
  closed_won:      { label: 'Closed Won',       color: '#126940', bg: '#D4F0E3' },
  closed_lost:     { label: 'Closed Lost',      color: '#B03030', bg: '#F5DADA' },
  dropped:         { label: 'Dropped',          color: '#7A6060', bg: '#EDE5E5' },
};

export const HOME_STATUS_META: Record<HomeStatus, { label: string; color: string; bg: string }> = {
  pending:            { label: 'Pending',          color: '#5C554C', bg: '#F0EDE8' },
  more_info_requested:{ label: 'Info Requested',   color: '#B05B15', bg: '#FAE9D8' },
  approved:           { label: 'Approved',          color: '#126940', bg: '#D4F0E3' },
  rejected:           { label: 'Rejected',          color: '#B03030', bg: '#F5DADA' },
};

export const LISTING_STATUS_META: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  available:  { label: 'Available',  color: '#126940', bg: '#D4F0E3' },
  in_deal:    { label: 'In Deal',    color: '#B05B15', bg: '#FAE9D8' },
  reserved:   { label: 'Reserved',   color: '#6B4CA6', bg: '#EDE6F8' },
  sold:       { label: 'Sold',       color: '#2A6EBB', bg: '#E5EEF8' },
  off_market: { label: 'Off Market', color: '#5C554C', bg: '#F0EDE8' },
};

export const PROP_LABEL: Record<PropertyType, string> = {
  apartment: 'Apartment', villa: 'Villa', plot: 'Plot', penthouse: 'Penthouse',
  farmhouse: 'Farmhouse', studio: 'Studio', row_house: 'Row House', duplex: 'Duplex',
};

export const SOURCE_LABEL: Record<ClientSource, string> = {
  web: 'Web', agent: 'Agent', referral: 'Referral',
};

export const UPDATE_LABEL: Record<UpdateType, string> = {
  call: 'Call', meeting: 'Meeting', site_visit: 'Site Visit',
  email: 'Email', whatsapp: 'WhatsApp', note: 'Note',
  status_change: 'Status Changed', reassignment: 'Reassigned', system: 'System',
};
