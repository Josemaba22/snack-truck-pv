import { Snack } from './Snack';
export interface SnackCategory {
  uuid: string;
  name: string;
  snacks: Snack[];
  isVisible: boolean;
}
