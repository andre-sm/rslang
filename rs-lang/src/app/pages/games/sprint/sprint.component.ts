import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintGameService } from '../../../services/sprintgame.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResultFormComponent } from '../result-form/result-form.component';
import { Word } from 'src/app/models/words';
import { UserWord } from 'src/app/models/user-word.model';
import { UserAggregatedWord } from 'src/app/models/user-aggregated-word.model';
import { UserAggregatedWordResponse } from 'src/app/models/user-aggregated-word-response.model';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';
const GAME_TIME = 61;

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
})
export class SprintComponent implements OnInit {
  englishWord: string = '';
  russianWord: string | undefined = '';
  words: (Word | UserAggregatedWord)[] = [];
  currentWord?: Word | UserAggregatedWord;
  fakeWords: Word[] = [];
  isLogged: boolean = false;
  userId: string = '';
  fakeTranslate = false;
  score = 0;
  time = GAME_TIME;
  difficulty = 0;
  page = 0;
  cardsPerPage = 20;
  audio = '';
  results: (Word | UserAggregatedWord)[] = [];
  params?: { group?: string; page?: string };
  requestBody?: UserWord;
  isFromTextbook = false;
  isMistake = false;
  isNewWord = true;
  newWordCount = 0;
  correctSeries = 0;
  bestSeries: Array<number> = [];

  constructor(
    private sprintGameService: SprintGameService,
    private http: HttpClient,
    public dialog: MatDialog,
    private storageService: StorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLogged = this.storageService.isLoggedIn();
    this.userId = this.storageService.getUser()?.userId || '';

    this.route.queryParams.subscribe((value) => {
      this.params = value as { group?: string; page?: string };
      if (this.params.group) {
        this.isFromTextbook = true;
      }
    });

    if (this.isFromTextbook) {
      this.difficulty = Number(this.params?.group);
      this.page = Number(this.params?.page);
      this.showWord();
      this.setGameTimer();
    } else {
      this.sprintGameService.difficulty$.subscribe((difficulty) => {
        this.difficulty = difficulty;
        this.showWord();
        this.setGameTimer();
      });
    }
  }

  async getWord() {
    let wordsPage;
    if (this.isFromTextbook) {
      wordsPage = Math.floor(Math.random() * this.page);
    } else {
      wordsPage = Math.floor(Math.random() * 29);
    }

    if (this.userId) {
      const queryParams = `users/${this.userId}/aggregatedWords?group=${this.difficulty}&page=${wordsPage}&wordsPerPage=${this.cardsPerPage}`;
      const url = `${BASE_URL}${queryParams}`;
      const data = this.http.get<UserAggregatedWordResponse[]>(url);
      const wordsReaponse = await lastValueFrom(data);
      this.words = wordsReaponse[0].paginatedResults;
    } else {
      const queryParams = `?group=${this.difficulty}&page=${wordsPage}`;
      const url = `${BASE_URL}words${queryParams}`;
      const data = this.http.get<Word[]>(url);
      this.words = await lastValueFrom(data);
    }

    const word = Math.floor(Math.random() * 19);
    this.currentWord = this.words[word];
    const fakeTranslate = Math.floor(Math.random() * 2);

    if (!fakeTranslate) {
      // TODO check if right translate
      const page = Math.floor(Math.random() * 29);
      const data = this.http.get<Word[]>(`${BASE_URL}words?group=${this.difficulty}&page=${page}`);
      const fakeWords = await lastValueFrom(data);
      const fakeWord = Math.floor(Math.random() * 19);
      this.words[word].fakeTranslate = fakeWords[fakeWord].wordTranslate;
    }
    return this.words[word];
  }

  setGameTimer() {
    const gameTimer = timer(1000, 1000).subscribe(() => {
      if (this.time) {
        this.time--;
      } else {
        gameTimer.unsubscribe();
        this.bestSeries.push(this.correctSeries);
        this.results.pop();
        this.prepareGameStats();
        this.showResult();
      }
    });
  }

  async showWord() {
    const word = await this.getWord();
    this.results.push(word);
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
        this.results[this.results.length - 1].answer = true;
        this.isMistake = false;
        this.correctSeries++;
      } else {
        this.bestSeries.push(this.correctSeries);
        this.correctSeries = 0;
        this.isMistake = true;
      }
      if (this.userId) {
        this.saveWordStats();
      }
    } else if (answer === 'No') {
      if (this.fakeTranslate) {
        this.score += 10;
        this.results[this.results.length - 1].answer = true;
        this.isMistake = false;
        this.correctSeries++;
      } else {
        this.isMistake = true;
        this.bestSeries.push(this.correctSeries);
        this.correctSeries = 0;
      }

      if (this.userId) {
        this.saveWordStats();
      }
    }
    this.showWord();
  }

  saveWordStats() {
    const currentWord = this.currentWord as UserAggregatedWord;
    this.isNewWord = !currentWord.userWord?.optional;
    if (this.isNewWord) {
      this.newWordCount++;
      if (currentWord.userWord?.difficulty) {
        this.requestBody = { ...currentWord.userWord, optional: { total: 1, success: this.isMistake ? 0 : 1 } };
        this.sprintGameService.updateUserWord(this.userId, currentWord._id, this.requestBody);
      } else {
        this.requestBody = { optional: { total: 1, success: this.isMistake ? 0 : 1 } };
        this.sprintGameService.createUserWord(this.userId, currentWord._id, this.requestBody);
      }
    } else {
      let currentTotal = currentWord.userWord?.optional?.total as number;
      let currentSuccess = currentWord.userWord?.optional?.success as number;
      this.requestBody = {
        ...currentWord.userWord,
        optional: { total: ++currentTotal, success: this.isMistake ? currentSuccess : ++currentSuccess },
      };
      
      this.sprintGameService.updateUserWord(this.userId, currentWord._id, this.requestBody);
    }
  }

  showResult() {
    this.sprintGameService.sendResult(this.results);
    this.openDialog('0ms', '0ms');
  }

  getSound() {
    const sound = new Audio(this.audio);
    sound.play();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ResultFormComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  prepareGameStats() {
    const successAnswers = this.bestSeries.reduce((acc, cur) => acc + cur, 0);
    const bestSeries = Math.max(...this.bestSeries);
    const wordsNumber = this.results.length;
    const successPercentage = Math.round(successAnswers * 100 / wordsNumber);
  }
}
