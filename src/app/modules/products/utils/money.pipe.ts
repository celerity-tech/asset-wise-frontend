import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a peso amount for display. Accepts the decimal strings the API returns
 * (e.g. "54990") or a number, and renders "₱54,990.00". Pure: the formatter is
 * built once and reused. Pair with `tabular-nums` so columns align to the digit.
 */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private static readonly formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  transform(value: string | number | null | undefined): string {
    if (value == null || value === '') {
      return '—';
    }
    const amount = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(amount)) {
      return '—';
    }
    return MoneyPipe.formatter.format(amount);
  }
}
