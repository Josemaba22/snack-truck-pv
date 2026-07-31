import { CategoryResponse } from '../api/category.api';

export interface CategoryUi extends CategoryResponse {
  dropdown: boolean;
}
