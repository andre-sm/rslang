import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/pages/textbook/models/word';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})

export class WordCardComponent {

  @Input() words?: Word[];
  @Output() soundIconClick = new EventEmitter<Word>();
  baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  onSoundIconClick(word: Word): void {
    this.soundIconClick.emit(word);
  }

}
