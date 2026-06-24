/** Membership role within an organization (Better Auth organization plugin). */
export type OrgRole = 'owner' | 'admin' | 'member';

/** An organization as returned by the Better Auth organization plugin. */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  /** Logo URL. Set by the platform operator; null until one is provided. */
  logo: string | null;
  metadata?: string | null;
  createdAt?: string;
}

/** A member row of an organization, with the linked user when expanded. */
export interface OrgMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

/** Active organization with its membership, from `organization/get-full-organization`. */
export interface FullOrganization extends Organization {
  members: OrgMember[];
}

/** Last-known org identity for this device, cached so the sign-in screen can brand itself. */
export interface CachedOrgIdentity {
  readonly name: string;
  readonly logo: string | null;
  readonly slug: string;
}
