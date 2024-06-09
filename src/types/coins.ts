export enum CategorySearch {
  FAVOURITES = 'FAVOURITES',
  ALL_COINS = 'ALL COINS',
}

export interface SettingsItems {
  rowHeight: number;
  totalItems: number;
  containerHeight: string;
  items: string[];
  visibleItemsLength: number;
}
