import { Component, OnInit } from '@angular/core';
import { DifficultyService } from '../../../services/difficulty.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, timer } from 'rxjs';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

const COUNT_RANDOM_WORDS = 100;

interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string,
  fakeTranslate?: string
}

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})

export class SprintComponent implements OnInit {
  englishWord: string = '';
  russianWord: string | undefined = '';
  words: IWord[] = [];
  randomWords: IWord[] = [];
  randomWordsPosition = 0;
  fakeTranslate = false;
  score = 0;
  time = 60;

  constructor(private difficultyService: DifficultyService, private http: HttpClient) { }

  ngOnInit() {
    this.difficultyService.difficulty$.subscribe((difficulty) => {
      this.getWords(difficulty);
    });
  }

  async getWords(difficulty: number) {
    for (let i = 0; i <= 4; i++) {
      const page = Math.floor(Math.random() * 29);
      const data = this.getAllwords(difficulty, page);
      const words = await lastValueFrom(data);
      this.words = [...this.words, ...words];
    }
    this.setWords();
  }

  getAllwords(difficulty: number, page: number): Observable<any> {
    return this.http.get<IWord[]>(`${BASE_URL}words?group=${difficulty}&page=${page}`);
  }

  setWords() {
    this.createRandomWords();
    this.setTimer();
    this.showWord();
  }

  setTimer() {
    const gameTimer = timer(1000, 1000).subscribe(() => this.time--);
  }

  showWord() {
    this.englishWord = this.words[this.randomWordsPosition].word;
    
    if (this.words[this.randomWordsPosition].fakeTranslate) {
      this.russianWord = this.words[this.randomWordsPosition].fakeTranslate;
      this.fakeTranslate = true;
    } else {
      this.russianWord = this.words[this.randomWordsPosition].wordTranslate;
      this.fakeTranslate = false;
    }
    this.randomWordsPosition++;
  }

  async createRandomWords() {
    this.words.sort( () => Math.random() - 0.5 );
    this.words = this.words.slice(0, COUNT_RANDOM_WORDS);

    this.words.forEach( word => {
      const randomNumberFakeTranslate = Math.floor(Math.random() * 2);

      if (!randomNumberFakeTranslate) {
        const randomNumber = Math.floor(Math.random() * COUNT_RANDOM_WORDS - 1);
        word.fakeTranslate = this.words[randomNumber].wordTranslate;
      }
    });
  }

  checkAnswer(answer: string) {
    if (answer === 'Yes') {
      if (!this.fakeTranslate) {
        this.score += 10;
      }
    } else if (answer === 'No') {
      if (this.fakeTranslate) {
        this.score += 10;
      }
    }
    this.showWord();
  }

}
