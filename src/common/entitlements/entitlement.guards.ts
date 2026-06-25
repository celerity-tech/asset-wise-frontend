import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { EntitlementsService } from './entitlements.service';

/** Blocks POS-module routes (pos/sales/reports) for plans without POS (BASIC). Redirects home. */
export const posGuard: CanActivateFn = () => {
  const entitlements = inject(EntitlementsService);
  const router = inject(Router);
  return entitlements.canUsePos() ? true : router.parseUrl('/');
};
