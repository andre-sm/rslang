import { Component, OnInit } from '@angular/core';
import { SprintGameService } from '../../../services/sprintgame.service';
import { StatisticsService } from '../../../services/statistics.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, of, Subscription, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResultFormComponent } from '../result-form/result-form.component';
import { Word } from 'src/app/models/words';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';
const GAME_TIME = 10;

@Component({
  selector: 'app-audio-call',
  templateUrl: './audio-call.component.html',
  styleUrls: ['./audio-call.component.scss']
})
export class AudioCallComponent implements OnInit {

  difficulty = 0;
  time = GAME_TIME;
  results: Word[] = [];
  englishWord: string = '';
  russianWord: string | undefined = '';
  audio = '';
  life = 5;
  answer = 0;
  answersText = {
    firstAnswer: '',
    secondAnswer: '',
    thirdAnswer: '',
    forthAnswer: '',
  };
  gameTimer: Subscription | undefined;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private sprintGameService: SprintGameService,
    private statisticsService: StatisticsService
  ) { }

  ngOnInit(): void {
    this.sprintGameService.difficulty$.subscribe((difficulty) => {
      this.difficulty = difficulty;
      this.showWord();
    });
  }

  async getWord() {
    const page = Math.floor(Math.random() * 29);
    const data = this.http.get<Word[]>(`${BASE_URL}words?group=${this.difficulty}&page=${page}`);
    const words = await lastValueFrom(data);
    const word = Math.floor(Math.random() * 19);

    for (const property in this.answersText) {
      let answer = '';

      while (answer === words[word].wordTranslate || !answer) {
        answer = await this.getWrongAnswer();
      }

      this.answersText[property as keyof typeof this.answersText] = answer;
    }

    this.answer = Math.floor(1 + Math.random() * (4 + 1 - 1));
    const rightAnswerKey = Object.keys(this.answersText)[this.answer - 1];
    this.answersText[rightAnswerKey as keyof typeof this.answersText] = words[word].wordTranslate;

    this.getSound(words[word]);
    return words[word];
  }

  getSound(word: Word) {
    const sound = new Audio(`${BASE_URL}${word.audio}`);
    sound.play();
  }

  async showWord() {
    if (this.life) {
      const word = await this.getWord();
      this.results.push(word);
      this.audio = `${BASE_URL}${word.audio}`;
      this.englishWord = word.word;
      this.russianWord = word.wordTranslate;
      this.setGameTimer();
      return
    }
    this.showResult();
  }

  setGameTimer() {
    this.gameTimer = timer(1000, 1000).subscribe(() => {
      if (this.time) {
        this.time--;
      } else {
        this.life--;
        this.gameTimer?.unsubscribe();
        this.time = GAME_TIME;
        this.showWord();
      }
    });
  }

  async getWrongAnswer() {
    const page = Math.floor(Math.random() * 29);
    const data = this.http.get<Word[]>(`${BASE_URL}words?group=${this.difficulty}&page=${page}`);
    const words = await lastValueFrom(data);
    const word = Math.floor(Math.random() * 19);

    return words[word].wordTranslate
  }

  checkAnswer(answer: number) {
    if (answer !== this.answer) {
      this.life--;
    }
    this.gameTimer?.unsubscribe();
    this.time = GAME_TIME;
    this.showWord();
  }

  showResult() {
    this.sprintGameService.sendResult(this.results);
    this.openDialog('0ms', '0ms');
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ResultFormComponent, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}
