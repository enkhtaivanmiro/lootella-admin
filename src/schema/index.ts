export interface ErrorType {
  message: string;
  error: string;
  statusCode: number;
}

export interface PriceType {
  currency: string;
  amount: number;
}
export interface UserType {
  id: string;
  createdAt: string;
  updatedAt: string;
  account_id: string;
  profile_image: string | null;
  display_name: string;
  trade_url: string | null;
  serverSeedHash: string;
  clientSeed: string;
  is_purchased: boolean;
  ref_code: string | null;
  nonce: number;
  referred_by_code: string | null;
  level_price: number;
  level: number;
  role: 'user' | 'admin' | 'creator';
}
export interface CaseType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  image: string;
  defaultMode: string;
  maxAllowedQuantity: number;
  primaryContainerId: string | null;
  oddsId: string;
  information: string | null;
  countdown: string | null;
  isActive: boolean;
  category: string;
  price: PriceType;
}

export interface CaseItemType {
  id: string;
  itemId: string;
  image: string;
  rarity: string;
  name: string;
  hashName: string;
  origin: string;
  value: number;
  fromTicket: number;
  toTicket: number;
  tickets: number;
}

export interface CaseContainerType {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  defaultMode: string;
  maxAllowedQuantity: number;
  primaryContainerId: string | null;
  items: CaseItemType[];
  oddsId: string;
  information: string | null;
  isEnabled: boolean;
  countdown: string | null;
  category: string;
}

export interface CaseDetailResponseType {
  containers: CaseContainerType[];
}

export interface CasesAllResponseType {
  [category: string]: CaseType[];
}
