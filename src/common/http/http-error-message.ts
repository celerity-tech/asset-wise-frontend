import { HttpErrorResponse } from '@angular/common/http';

/** Pull the backend's human message out of an error envelope, if it sent one. */
function backendMessage(error: HttpErrorResponse): string | null {
  const raw = error.error?.message;
  if (Array.isArray(raw)) {
    // class-validator returns an array of messages; show the first, most specific one.
    return raw.length ? String(raw[0]) : null;
  }
  return typeof raw === 'string' && raw.trim() ? raw : null;
}

/**
 * Map an HTTP failure to a short, recoverable message for the operator at the
 * counter. Prefers the backend's own message (it ships clear ones) and falls
 * back to status-specific copy.
 */
export function httpErrorMessage(error: unknown, conflictLabel?: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Cannot reach the server. Check your connection and try again.';
    }
    if (error.status === 409 && conflictLabel) {
      return `${conflictLabel} already exists.`;
    }
    if (error.status === 429) {
      return 'Too many requests in a short time. Wait a moment, then try again.';
    }

    const message = backendMessage(error);
    if (message) {
      return message;
    }
    if (error.status === 400 || error.status === 422) {
      return 'Some details are invalid. Check the fields and try again.';
    }
  }
  return 'Something went wrong. Try again.';
}
