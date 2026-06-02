/**
 * A physical place stock lives (e.g. "Main Warehouse", "Front Shelf"). Flat master
 * data; products and stock movements reference it. The `code` is the scan anchor:
 * print it on a label, scan it later to audit what should be where.
 */
export interface Location {
  id: string;
  name: string;
  /** Unique scannable code printed on the location's label. Null until one is set. */
  code: string | null;
  description: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating or updating a location. */
export interface LocationRequest {
  name: string;
  code?: string;
  description?: string;
}
