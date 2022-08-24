import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/pages/textbook/models/word.model';
import { UserAggregatedWord } from '../../models/user-aggregated-word.model';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})

export class WordCardComponent {

  @Input() word?: Word | UserAggregatedWord;
  @Input() isLogged?: boolean;
  @Output() soundIconClick = new EventEmitter<Word | UserAggregatedWord>();
  @Output() hardWordClick = new EventEmitter<UserAggregatedWord>();
  @Output() learnedWordClick = new EventEmitter<UserAggregatedWord>();
  baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  onSoundIconClick(word?: Word | UserAggregatedWord): void {
    this.soundIconClick.emit(word);
  }

  onHardWordBtnClick(word?: UserAggregatedWord): void {
    this.hardWordClick.emit(word);
  }

  onLearnedWordBtnClick(word?: UserAggregatedWord): void {
    this.learnedWordClick.emit(word);
  }

}
