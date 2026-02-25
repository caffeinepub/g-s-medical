import type { Order } from '../backend';

export type SortDirection = 'asc' | 'desc';

export function sortByDate(orders: Order[], direction: SortDirection): Order[] {
  return [...orders].sort((a, b) => {
    const diff = Number(a.createdAt) - Number(b.createdAt);
    return direction === 'asc' ? diff : -diff;
  });
}

export function sortByAmount(orders: Order[], direction: SortDirection): Order[] {
  return [...orders].sort((a, b) => {
    const diff = Number(a.totalAmount) - Number(b.totalAmount);
    return direction === 'asc' ? diff : -diff;
  });
}
