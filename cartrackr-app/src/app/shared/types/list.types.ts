export type List<T> = readonly T[];

export type PaginationMeta = {
  readonly currentPage: number;
  readonly hasMore: boolean;
  readonly isLoading: boolean;
};
