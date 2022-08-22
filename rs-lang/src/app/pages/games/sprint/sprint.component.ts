import { Component, OnInit } from '@angular/core';
import { DifficultyService } from '../../../services/difficulty.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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

  constructor(private difficultyService: DifficultyService, private http: HttpClient) { }

  ngOnInit() {
    this.difficultyService.difficulty$.subscribe((difficulty) => {
      this.getWords(difficulty);
    });
  }

  getWords(difficulty: number) {
    for (let i = 0; i <= 29; i++) {
      this.http
      .get<IWord[]>(`${BASE_URL}words?group=${difficulty}&page=${i}`, httpOptions)
      .subscribe((data: IWord[]) => {
        this.concatArrays(data, i);
      });
    }
  }

  concatArrays(data: IWord[], calls: number) {
    this.words = this.words.concat(data);
    if (calls === 29) {
      this.setWords();
    }
  }

  setWords() {
    this.createRandomWords();
    this.showWord();
  }

  showWord() {
    this.englishWord = this.randomWords[this.randomWordsPosition].word;
    
    if (this.randomWords[this.randomWordsPosition].fakeTranslate) {
      this.russianWord = this.randomWords[this.randomWordsPosition].fakeTranslate;
      this.fakeTranslate = true;
    } else {
      this.russianWord = this.randomWords[this.randomWordsPosition].wordTranslate;
      this.fakeTranslate = false;
    }
    console.log(this.randomWords[this.randomWordsPosition]);
    this.randomWordsPosition++;
  }

  createRandomWords() {
    this.randomWords = [...this.words];
    this.randomWords.sort( () => Math.random() - 0.5 );
    this.randomWords = this.randomWords.slice(0, COUNT_RANDOM_WORDS);

    this.randomWords.forEach(word => {
      const randomNumberFakeTranslate = Math.floor(Math.random() * 2);

      if (!randomNumberFakeTranslate) {
        const randomNumber = Math.floor(Math.random() * COUNT_RANDOM_WORDS - 1);
        word.fakeTranslate = this.randomWords[randomNumber].wordTranslate;
      }
    });
  }

  checkAnswer(answer: string) {
    if (answer === 'Yes') {
      if (this.fakeTranslate) {
        if (this.score !== 0) {
          this.score-=10;
        }
      } else {
        this.score+=10;
      }
    } else if (answer === 'No') {
      if (!this.fakeTranslate) {
        if (this.score !== 0) {
          this.score-=10;
        }
      } else {
        this.score+=10;
      }
    }

    console.log(this.score);
    this.showWord();
  }

}
