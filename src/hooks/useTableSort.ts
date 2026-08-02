import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export function useTableSort<T extends Record<string, any>>(
  data: T[],
  defaultSortKey?: keyof T,
  defaultDirection: SortDirection = 'asc'
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    defaultSortKey ? { key: defaultSortKey, direction: defaultDirection } : null
  );

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'string') {
        comparison = aVal.localeCompare(String(bVal));
      } else if (typeof aVal === 'number') {
        comparison = aVal - Number(bVal);
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIndicator = (key: keyof T): string => {
    if (sortConfig?.key !== key) return '';
    if (sortConfig.direction === 'asc') return ' ↑';
    if (sortConfig.direction === 'desc') return ' ↓';
    return '';
  };

  return { sortedData, requestSort, getSortIndicator, sortConfig };
}
