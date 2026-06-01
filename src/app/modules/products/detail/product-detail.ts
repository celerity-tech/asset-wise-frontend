import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';

import { ProductsService } from '../services/products.service';
import { Product, stockState } from '../types/product.types';
import { httpErrorMessage } from '../../../../common/http/http-error-message';
import { MoneyPipe } from '../utils/money.pipe';
import { ProductForm } from '../form/product-form';

/**
 * Detail pane for one product: an at-a-glance stock and price summary, the full
 * record, and inline edit (via the shared product form) and archive. Owns only
 * transient pane state; reports product mutations up to the catalog container.
 */
@Component({
  selector: 'app-product-detail',
  imports: [ButtonModule, DatePipe, DecimalPipe, MoneyPipe, ProductForm],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class ProductDetail {
  private readonly service = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = input.required<Product>();
  readonly updated = output<Product>();
  readonly archived = output<string>();

  protected readonly editing = signal(false);
  protected readonly archiving = signal(false);
  protected readonly archiveBusy = signal(false);
  protected readonly archiveError = signal<string | null>(null);

  protected readonly stock = computed(() => stockState(this.product()));
  protected readonly margin = computed(() => {
    const product = this.product();
    const selling = Number(product.sellingPrice);
    const cost = Number(product.costPrice);
    const amount = selling - cost;
    const pct = selling > 0 ? (amount / selling) * 100 : null;
    return { amount, pct };
  });

  constructor() {
    // Selecting a different product drops any open edit/archive state from the
    // previous one so the pane never shows stale intent.
    effect(() => {
      this.product();
      this.editing.set(false);
      this.archiving.set(false);
      this.archiveError.set(null);
    });
  }

  protected startEdit(): void {
    this.cancelArchive();
    this.editing.set(true);
  }

  protected onSaved(product: Product): void {
    this.editing.set(false);
    this.updated.emit(product);
  }

  protected confirmArchive(): void {
    this.editing.set(false);
    this.archiveError.set(null);
    this.archiving.set(true);
  }

  protected cancelArchive(): void {
    this.archiving.set(false);
    this.archiveError.set(null);
  }

  protected archive(): void {
    if (this.archiveBusy()) {
      return;
    }
    const id = this.product().id;
    this.archiveBusy.set(true);
    this.archiveError.set(null);
    this.service
      .archive(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.archiveBusy.set(false)),
      )
      .subscribe({
        next: () => {
          this.archiving.set(false);
          this.archived.emit(id);
        },
        error: (error: unknown) => this.archiveError.set(httpErrorMessage(error)),
      });
  }

  protected onEscape(): void {
    this.cancelArchive();
  }
}
