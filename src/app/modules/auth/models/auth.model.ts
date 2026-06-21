export interface LoginRequest {
  email: string;
  password: string;
}

/** The authenticated user, as returned by Better Auth (`user` on sign-in / get-session). */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  /** System-level role: 'admin' = platform super-admin, 'user' = everyone else. */
  role: string;
  image: string | null;
}

/** Response of `POST /auth/sign-in/email`. The session lives in an httpOnly cookie; `token` is unused. */
export interface SignInResponse {
  redirect: boolean;
  token: string;
  user: AuthUser;
}

/** Response of `GET /auth/get-session` (the body is `null` when unauthenticated). */
export interface SessionResponse {
  session: {
    activeOrganizationId: string | null;
    userId: string;
    expiresAt: string;
  };
  user: AuthUser;
}
