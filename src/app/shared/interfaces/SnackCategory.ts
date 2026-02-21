export interface SnackItem {
  uuid: string;
  name: string;
}

export interface SnackCategory {
  uuid: string;
  name: string;
  snackitems: SnackItem[];
  isVisible: boolean;
}
