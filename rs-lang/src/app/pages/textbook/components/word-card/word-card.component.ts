import { Component, OnChanges, Input } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from 'src/app/pages/textbook/services/word.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})

export class WordCardComponent implements OnChanges {

  @Input() group: number = 0;
  page: number = 0;
  words: Word[] = [];
  totalWords = 600;
  cardsPerPage = 20;
  baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  constructor(private wordService: WordService) { }

  ngOnChanges(): void {
    this.getWords();
  }

  getWords(): void {
    this.wordService.getWords(this.group, this.page).subscribe(words => this.words = words);
  }

  onPageChanged(pageData: PageEvent) {
    this.page = pageData.pageIndex;
    this.getWords();
  }

}
