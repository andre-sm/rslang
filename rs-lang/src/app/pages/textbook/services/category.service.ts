import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [ 
    { group: 0, name: 'A1' },
    { group: 1, name: 'A2' },
    { group: 2, name: 'B1' },
    { group: 3, name: 'B2' },
    { group: 4, name: 'C1' },
    { group: 5, name: 'C2' },
  ];

  constructor() { }

  getCategories(): Category[] {
    return this.categories;
  }
}
