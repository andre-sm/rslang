import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/pages/textbook/models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  @Input() categories?: Category[] = [];
  @Input() selectedCategory?: number;
  @Input() isHardWordsChecked?: boolean;
  @Output() categoryChange = new EventEmitter<number>();

  onSelect(category: Category): void {
    this.categoryChange.emit(category.group);
  }

  getClass(category: number): string {
    return `category-btn-${category}`;
  }

}
