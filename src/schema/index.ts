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
  role: Role;
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

export interface WonItemType {
  id: string;
  createdAt: string;
  skinId: string;
  isLocked: boolean;
  rollId: string;
  sourceId: string;
  userId: string;
  status: string;
  sourceType: string;
  skin: {
    id: string;
    name: string;
    marketHashName: string;
    image: string;
    price: number;
    rarity: string;
  };
}

export interface PaymentType {
  id: string;
  createdAt: string;
  userId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string | null;
  user?: {
    display_name: string;
  };
}

export enum CaseCategory {
  REGULAR = 'regular',
  STICKER = 'sticker',
  DEDICATED = 'dedicated',
  COUNTER_STRIKE = 'counter-strike',
  FIFTY_FIFTY = 'fifty-fifty',
  SOCIAL = 'social',
  PLAYER = 'player',
}

export enum CaseMode {
  DAILY = 'daily',
  WALLET = 'wallet',
  CODE = 'code',
}

export enum Currency {
  MNT = 'mnt',
  USD = 'usd',
  REFFERAL = 'refferal',
  AMMO = 'ammo',
}

export enum Role {
  ADMIN = 'admin',
  CREATOR = 'creator',
  USER = 'user',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export enum PaymentMethod {
  QPAY = 'qpay',
  ITEM = 'item',
  SOCIALPAY = 'socialpay',
}

export enum SkinExterior {
  FACTORY_NEW = 'Factory New',
  MINIMAL_WEAR = 'Minimal Wear',
  FIELD_TESTED = 'Field-Tested',
  WELL_WORN = 'Well-Worn',
  BATTLE_SCARRED = 'Battle-Scarred',
}

export enum SkinRarity {
  CONSUMER_GRADE = 'Consumer Grade',
  INDUSTRIAL_GRADE = 'Industrial Grade',
  MIL_SPEC_GRADE = 'Mil-Spec Grade',
  RESTRICTED = 'Restricted',
  CLASSIFIED = 'Classified',
  COVERT = 'Covert',
  CONTRABAND = 'Contraband',
  EXTRAORDINARY = 'Extraordinary',
  HIGH_GRADE = 'High Grade',
  REMARKABLE = 'Remarkable',
  EXOTIC = 'Exotic',
}

export enum SkinType {
  PISTOL = 'Pistol',
  RIFLE = 'Rifle',
  SNIPER_RIFLE = 'Sniper Rifle',
  SMG = 'SMG',
  SHOTGUN = 'Shotgun',
  MACHINEGUN = 'Machinegun',
  KNIFE = 'Knife',
  GLOVES = 'Gloves',
  STICKER = 'Sticker',
  AGENT = 'Agent',
  CONTAINER = 'Container',
  MUSIC_KIT = 'Music Kit',
  COLLECTIBLE = 'Collectible',
  PASS = 'Pass',
  TOOL = 'Tool',
}

export interface SkinItemType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  marketHashName: string;
  image: string;
  type: string;
  exterior: string;
  price: number;
  rarity: string;
  isStatTrak: boolean;
}
