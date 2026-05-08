import { CategoryDb } from '../db/category.db';

export interface CategoryUi extends CategoryDb {
  dropdown: boolean;
}
