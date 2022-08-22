import { Component, OnChanges, Input } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from 'src/app/pages/textbook/services/word.service';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})

export class WordCardComponent implements OnChanges {

  @Input() group: number = 0;
  words: Word[] = [];
  public baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  constructor(private wordService: WordService) { }

  ngOnChanges(): void {
    this.getWords();
  }

  getWords(): void {
    this.wordService.getWords(this.group).subscribe(words => this.words = words);
  }

}
