import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

import { httpErrorMessage } from '../../../common/http/http-error-message';
import { ProductsService } from '../products/services/products.service';
import { Product } from '../products/types/product.types';
import { StockMovementsService } from './services/stock-movements.service';
import {
  MOVEMENT_TYPES,
  MovementTypeOption,
  StockMovement,
  StockMovementListQuery,
  StockMovementType,
  movementTypeMeta,
} from './types/stock-movement.types';
import { StockMovementRecord } from './record/stock-movement-record';
import { StockMovementDetail } from './detail/stock-movement-detail';

@Component({
  selector: 'app-stock-movements',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    ButtonModule,
    SelectModule,
    AutoCompleteModule,
    DatePickerModule,
    TableModule,
    StockMovementRecord,
    StockMovementDetail,
  ],
  templateUrl: './stock-movements.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockMovements {
  private readonly service = inject(StockMovementsService);
  private readonly products = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly movements = signal<StockMovement[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly rows = 10;
  protected readonly first = signal(0);

  protected readonly typeOptions: MovementTypeOption[] = [...MOVEMENT_TYPES];
  protected readonly productFilter = new FormControl<Product | null>(null);
  protected readonly typeFilter = new FormControl<StockMovementType | null>(null);
  /** Range picker value: [from, to]. */
  protected readonly dateRange = new FormControl<Date[] | null>(null);
  protected readonly productSuggestions = signal<Product[]>([]);

  protected readonly selected = signal<StockMovement | null>(null);
  protected readonly mode = signal<'record' | 'view'>('record');
  protected readonly paneOpenMobile = signal(false);

  protected readonly hasFilters = signal(false);

  constructor() {
    merge(this.productFilter.valueChanges, this.typeFilter.valueChanges, this.dateRange.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());

    this.load();
  }

  /** See products.ts: the table re-emits onLazyLoad on binding changes; only act on a real page change. */
  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const requestedFirst = event.first ?? 0;
    if (requestedFirst === this.first()) {
      return;
    }
    this.first.set(requestedFirst);
    this.load();
  }

  protected applyFilters(): void {
    this.first.set(0);
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.hasFilters.set(this.computeHasFilters());

    const range = this.dateRange.value;
    const query: StockMovementListQuery = {
      page: Math.floor(this.first() / this.rows) + 1,
      limit: this.rows,
      productId: this.productFilter.value?.id ?? undefined,
      type: this.typeFilter.value ?? undefined,
      dateFrom: this.startOfDayIso(range?.[0]),
      dateTo: this.endOfDayIso(range?.[1] ?? range?.[0]),
    };

    this.service
      .list(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items, meta }) => {
          this.movements.set(items);
          this.total.set(meta.total);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.loadError.set(httpErrorMessage(error));
          this.loading.set(false);
        },
      });
  }

  protected searchProducts(event: AutoCompleteCompleteEvent): void {
    this.products
      .list({ page: 1, limit: 10, search: event.query })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ items }) => this.productSuggestions.set(items),
        error: () => this.productSuggestions.set([]),
      });
  }

  protected clearFilters(): void {
    this.productFilter.setValue(null, { emitEvent: false });
    this.typeFilter.setValue(null, { emitEvent: false });
    this.dateRange.setValue(null, { emitEvent: false });
    this.applyFilters();
  }

  protected startRecord(): void {
    this.mode.set('record');
    this.selected.set(null);
    this.paneOpenMobile.set(true);
  }

  protected selectMovement(movement: StockMovement): void {
    this.mode.set('view');
    this.selected.set(movement);
    this.paneOpenMobile.set(true);
  }

  protected onSelectionChange(movement: StockMovement | null): void {
    if (movement) {
      this.selectMovement(movement);
    }
  }

  protected onRecorded(): void {
    // Newest entries sort to the top; jump to the first page so it shows.
    this.first.set(0);
    this.load();
  }

  protected backToList(): void {
    this.paneOpenMobile.set(false);
  }

  protected metaOf(type: StockMovementType): MovementTypeOption {
    return movementTypeMeta(type);
  }

  protected changeLabel(value: number): string {
    return value > 0 ? `+${value}` : `${value}`;
  }

  private computeHasFilters(): boolean {
    return (
      this.productFilter.value !== null ||
      this.typeFilter.value !== null ||
      (this.dateRange.value?.some(Boolean) ?? false)
    );
  }

  private startOfDayIso(date: Date | null | undefined): string | undefined {
    if (!date) {
      return undefined;
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start.toISOString();
  }

  private endOfDayIso(date: Date | null | undefined): string | undefined {
    if (!date) {
      return undefined;
    }
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end.toISOString();
  }
}
