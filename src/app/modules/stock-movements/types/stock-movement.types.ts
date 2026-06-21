import { Product } from '../../products/types/product.types';
import { Supplier } from '../../suppliers/types/supplier.types';
import { Location } from '../../locations/types/location.types';

/** Kinds of stock movement. Mirrors the backend `StockMovementType` enum. */
export type StockMovementType =
  | 'PURCHASE'
  | 'SALE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'RETURN'
  | 'INITIAL';

/**
 * The person who recorded a movement. Deliberately narrow: the backend currently
 * embeds the full user (including the password hash); we only ever read identity
 * fields, and the hash must never be referenced or rendered.
 */
export interface MovementUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

/**
 * One immutable entry in the stock ledger. `quantityChange` is signed (positive
 * for stock in, negative for stock out) and `quantityAfter` is the resulting
 * on-hand, both computed by the backend. Related product/supplier/location/user
 * come embedded.
 */
export interface StockMovement {
  id: string;
  type: StockMovementType;
  quantityChange: number;
  quantityAfter: number;
  note: string | null;

  productId: string;
  product: Product;

  productUnitId: string | null;

  locationId: string | null;
  location: Location | null;

  supplierId: string | null;
  supplier: Supplier | null;

  userId: string;
  user: MovementUser;

  createdAt: string;
}

/**
 * Payload to record a movement. `quantity` is always a positive integer; the
 * backend derives the signed change and resulting on-hand from the `type`.
 */
export interface StockMovementRequest {
  productId: string;
  type: StockMovementType;
  quantity: number;
  note?: string;
  supplierId?: string | null;
  locationId?: string | null;
}

/** Query for the server-paginated ledger. Mirrors the backend `FilterStockMovementsDTO`. */
export interface StockMovementListQuery {
  page: number;
  /** Capped at 50 by the backend. */
  limit: number;
  productId?: string;
  type?: StockMovementType;
  /** ISO date string (inclusive lower bound). */
  dateFrom?: string;
  /** ISO date string (inclusive upper bound). */
  dateTo?: string;
}

/** Whether a movement adds to, removes from, or nets out stock. Drives badge styling. */
export type MovementDirection = 'in' | 'out' | 'neutral';

/** Display metadata for a movement type: label, icon, direction, and form behaviour. */
export interface MovementTypeOption {
  readonly label: string;
  readonly value: StockMovementType;
  /** PrimeIcons class, e.g. `pi pi-shopping-cart`. */
  readonly icon: string;
  readonly direction: MovementDirection;
  /** Whether the record form surfaces a supplier field for this type. */
  readonly needsSupplier: boolean;
  /**
   * Whether the type can be chosen in the record form. TRANSFER is hidden until
   * the backend supports a source and destination location.
   */
  readonly selectable: boolean;
}

/**
 * Known movement types. TRANSFER is intentionally not selectable yet: the record
 * payload carries a single locationId and cannot express a source-to-destination
 * move. It still resolves here so historical TRANSFER rows display correctly.
 */
export const MOVEMENT_TYPES: readonly MovementTypeOption[] = [
  { label: 'Purchase', value: 'PURCHASE', icon: 'pi pi-shopping-cart', direction: 'in', needsSupplier: true, selectable: true },
  { label: 'Sale', value: 'SALE', icon: 'pi pi-shopping-bag', direction: 'out', needsSupplier: false, selectable: true },
  { label: 'Adjustment', value: 'ADJUSTMENT', icon: 'pi pi-sliders-h', direction: 'neutral', needsSupplier: false, selectable: true },
  { label: 'Return', value: 'RETURN', icon: 'pi pi-replay', direction: 'in', needsSupplier: true, selectable: true },
  { label: 'Initial', value: 'INITIAL', icon: 'pi pi-flag', direction: 'in', needsSupplier: false, selectable: true },
  { label: 'Transfer', value: 'TRANSFER', icon: 'pi pi-arrow-right-arrow-left', direction: 'neutral', needsSupplier: false, selectable: false },
];

/** Types offered in the record form picker. */
export const SELECTABLE_MOVEMENT_TYPES: readonly MovementTypeOption[] = MOVEMENT_TYPES.filter(
  (type) => type.selectable,
);

/** Resolve a movement type to its display metadata, tolerating values the enum may add later. */
export function movementTypeMeta(value: StockMovementType): MovementTypeOption {
  const known = MOVEMENT_TYPES.find((type) => type.value === value);
  if (known) {
    return known;
  }
  const label = value
    .toLowerCase()
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
  return { label: label || 'Movement', value, icon: 'pi pi-arrows-v', direction: 'neutral', needsSupplier: false, selectable: false };
}
