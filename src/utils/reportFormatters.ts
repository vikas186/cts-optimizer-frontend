import { formatNumber, formatPercent } from './formatters';

const MONEY_COLUMN_PATTERN =
  /(?:^|_)(revenue|profit|cts|cost|savings|allocated|expected|loss|amount|value)(?:_|$)/i;

export function isMarginPctColumn(columnId: string): boolean {
  return columnId === 'margin_pct' || columnId.endsWith('_margin_pct');
}

export function isMoneyColumn(columnId: string): boolean {
  if (isMarginPctColumn(columnId)) return false;
  if (columnId.includes('margin_pct')) return false;
  if (columnId.includes('cost_per_unit') || columnId.includes('per_unit')) return true;
  return MONEY_COLUMN_PATTERN.test(columnId);
}

/** Money columns are 2-decimal strings; margin_pct is a decimal ratio (×100 for %). */
export function formatReportCell(columnId: string, value: string): string {
  if (value === '' || value == null) return '—';
  if (isMarginPctColumn(columnId)) {
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return formatPercent(n);
  }
  if (isMoneyColumn(columnId)) {
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return formatNumber(n, 2);
  }
  return value;
}

export function humanizeColumnHeader(id: string): string {
  return id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
