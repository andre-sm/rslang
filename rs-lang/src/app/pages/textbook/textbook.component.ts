import { Component, OnInit } from '@angular/core';
import { Category } from './models/category';
import { Word } from './models/word';
import { CategoryService } from './services/category.service';
import { WordService } from './services/word.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss']
})
export class TextbookComponent implements OnInit {

  categories?: Category[];
  words: Word[] = [];
  category: number = 0;
  page: number = 0;
  totalWords = 600;
  cardsPerPage = 20;
  baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  constructor(private categoryService: CategoryService, private wordService: WordService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getWords();
  }

  getCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  onCategoryChanged(category: number) {
    this.category = category;
    this.getWords();
  }

  getWords(): void {
    this.wordService.getWords(this.category, this.page).subscribe(words => this.words = words);
  }

  onPageChanged(pageData: PageEvent) {
    this.page = pageData.pageIndex;
    this.getWords();
  }
}
