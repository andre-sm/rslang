import { Component, OnInit } from '@angular/core';
import { Category } from './models/category.model';
import { Word } from './models/word.model';
import { UserAggregatedWord } from './models/user-aggregated-word.model';
import { UserWord } from './models/user-word.model';
import { UserWordResponse } from './models/user-word-response.model';
import { CategoryService } from './services/category.service';
import { WordService } from './services/word.service';
import { StorageService } from 'src/app/services/storage.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss'],
})
export class TextbookComponent implements OnInit {
  categories?: Category[];
  words: (Word | UserAggregatedWord)[] = [];
  userWords: UserWord[] = [];
  category: number = 0;
  page: number = 0;
  totalWords = 600;
  cardsPerPage = 20;
  audio = new Audio();
  soundsToPlay?: Array<string>;
  isLogged: boolean = false;
  userId: string = '';
  learnedWords: number = 0;
  baseUrl = 'https://rss-rslang-be.herokuapp.com/';

  constructor(
    private categoryService: CategoryService,
    private wordService: WordService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.isLogged = this.storageService.isLoggedIn();
    this.userId = this.storageService.getUser()?.userId || '';
    if (this.userId) {
      this.getUserAggregatedWords();
    } else {
      this.getWords();
    }
    this.getCategories();
  }

  getCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  onCategoryChanged(category: number) {
    this.category = category;

    if (this.userId) {
      this.getUserAggregatedWords();
    } else {
      this.getWords();
    }
  }

  getWords(): void {
    this.wordService.getWords(this.category, this.page).subscribe((words) => (this.words = words));
  }

  getUserAggregatedWords(): void {
    this.wordService
      .getUserAggregatedWords(this.userId, this.category, this.page, this.cardsPerPage)
      .subscribe((words) => {
        this.calculateLearnedWords(words[0].paginatedResults);
        this.words = words[0].paginatedResults;
      });
  }

  onPageChanged(pageData: PageEvent) {
    this.page = pageData.pageIndex;
    this.audio.pause();
    if (this.userId) {
      this.getUserAggregatedWords();
    } else {
      this.getWords();
    }
  }

  onSoundIconClick(word: Word): void {
    this.soundsToPlay = [
      `${this.baseUrl}${word.audio}`,
      `${this.baseUrl}${word.audioMeaning}`,
      `${this.baseUrl}${word.audioExample}`,
    ];
    this.playSounds(this.soundsToPlay);
  }

  playSounds(sounds: Array<string>) {
    let count = 1;
    this.audio.src = sounds[0];
    this.audio.play();

    this.audio.onended = () => {
      if (count < sounds.length) {
        this.audio.src = sounds[count];
        this.audio.play();
        count++;
      }
    };
  }

  getUserWords(): void {
    this.wordService.getUserWords(this.userId).subscribe((userWords) => {
      this.userWords = userWords;
    });
  }

  addHardWord(word: UserAggregatedWord): void {
    if (word.userWord) {
      this.wordService.updateUserWord(this.userId, word._id, { difficulty: 'hard' }).subscribe((data) => {
        this.updateCurrentWordList(word, data, 'hard');
        this.calculateLearnedWords(this.words);
      });
    } else {
      this.wordService.addToHard(this.userId, word._id, { difficulty: 'hard' }).subscribe((data) => {
        this.updateCurrentWordList(word, data, 'hard');
        this.calculateLearnedWords(this.words);
      });
    }
  }

  addLearnedWord(word: UserAggregatedWord): void {
    if (word.userWord) {
      this.wordService.updateUserWord(this.userId, word._id, { difficulty: 'easy' }).subscribe((data) => {
        this.updateCurrentWordList(word, data, 'easy');
        this.calculateLearnedWords(this.words);
      });
    } else {
      this.wordService.addToLearned(this.userId, word._id, { difficulty: 'easy' }).subscribe((data) => {
        this.updateCurrentWordList(word, data, 'easy');
        this.calculateLearnedWords(this.words);
      });
    }
  }

  updateCurrentWordList(word: UserAggregatedWord, data: UserWordResponse, difficulty: string) {
    const learnedWordNewData = { ...word, userWord: { difficulty } };
    const wordsUpdated = this.words.map((word: UserAggregatedWord) => {
      return word._id === data.wordId ? learnedWordNewData : word;
    });
    this.words = wordsUpdated;
  }

  calculateLearnedWords(words: UserAggregatedWord[]) {
    this.learnedWords = words.filter((word) => word.userWord?.difficulty === 'easy').length;
  }
}
