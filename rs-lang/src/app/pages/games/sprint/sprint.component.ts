import { Component, OnInit } from '@angular/core';
import { DifficultyService } from '../../../services/difficulty.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, timer } from 'rxjs';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';
const GAME_TIME = 60

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
  fakeTranslate = false;
  score = 0;
  time = GAME_TIME;
  difficulty = 0;
  audio = '';

  constructor(private difficultyService: DifficultyService, private http: HttpClient) { }

  ngOnInit() {
    this.difficultyService.difficulty$.subscribe((difficulty) => {
      this.difficulty = difficulty;
      this.showWord();
      this.setGameTimer();
    });
  }

  async getWord() {
    const page = Math.floor(Math.random() * 29);
    const data = this.http.get<IWord[]>(`${BASE_URL}words?group=${this.difficulty}&page=${page}`);
    const words = await lastValueFrom(data);
    const word = Math.floor(Math.random() * 19);

    const fakeTranslate = Math.floor(Math.random() * 2);

    if (!fakeTranslate) {
      // TODO check if right translate
      const page = Math.floor(Math.random() * 29);
      const data = this.http.get<IWord[]>(`${BASE_URL}words?group=${this.difficulty}&page=${page}`);
      const fakeWords = await lastValueFrom(data);
      const fakeWord = Math.floor(Math.random() * 19);
      words[word].fakeTranslate = fakeWords[fakeWord].wordTranslate;
    }

    return words[word];
  }

  setGameTimer() {
    const gameTimer = timer(1000, 1000).subscribe(() => {
      if (this.time) {
        this.time--;
      }
    });
  }

  async showWord() {
    const word = await this.getWord();
    this.audio = `${BASE_URL}${word.audio}`;

    this.englishWord = word.word;

    if (word.fakeTranslate) {
      this.russianWord = word.fakeTranslate;
      this.fakeTranslate = true;
    } else {
      this.russianWord = word.wordTranslate;
      this.fakeTranslate = false;
    }
    
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

  showResult() {

  }

  getSound() {
    const sound = new Audio(this.audio)
    sound.play();
  }

}
