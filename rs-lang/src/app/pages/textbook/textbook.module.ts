import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextbookRoutingModule } from './textbook-routing.module';
import { TextbookComponent } from './textbook.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    TextbookComponent,
    CategoriesComponent,
    CategoryDetailComponent
  ],
  imports: [
    CommonModule,
    TextbookRoutingModule,
    MatButtonModule
  ]
})
export class TextbookModule { }
