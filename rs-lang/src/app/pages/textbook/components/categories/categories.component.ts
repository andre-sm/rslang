import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/pages/textbook/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  selectedCategory?: Category;
  categories: Category[] = [];
  @Output() onCategoryChange = new EventEmitter<number>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  onSelect(category: Category): void {
    this.selectedCategory = category;
    this.onCategoryChange.emit(this.selectedCategory.group);
  }

  getCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

}
