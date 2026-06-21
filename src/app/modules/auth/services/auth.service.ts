import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AuthUser, LoginRequest, SessionResponse, SignInResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authBaseUrl = `${environment.apiBaseUrl}/auth`;

  // Source of truth is the httpOnly session cookie; this signal mirrors it for the UI/guards and
  // is hydrated once at app start via loadSession().
  private readonly currentUser = signal<AuthUser | null>(null);
  readonly user = this.currentUser.asReadonly();

  // Hydrates the session from the cookie. Returns the user (or null) and never throws, so it is
  // safe to run as an app initializer. Better Auth returns 200 with a null body when signed out.
  loadSession(): Observable<AuthUser | null> {
    return this.http.get<SessionResponse | null>(`${this.authBaseUrl}/get-session`).pipe(
      map((response) => response?.user ?? null),
      catchError(() => of(null)),
      tap((user) => this.currentUser.set(user)),
    );
  }

  login(credentials: LoginRequest): Observable<AuthUser> {
    return this.http
      .post<SignInResponse>(`${this.authBaseUrl}/sign-in/email`, credentials)
      .pipe(
        map((response) => response.user),
        tap((user) => this.currentUser.set(user)),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authBaseUrl}/sign-out`, {}).pipe(
      catchError(() => of(undefined)),
      tap(() => this.currentUser.set(null)),
      map(() => undefined),
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  // Clears the cached session without a network call (used when the API reports 401).
  clearSession(): void {
    this.currentUser.set(null);
  }
}
