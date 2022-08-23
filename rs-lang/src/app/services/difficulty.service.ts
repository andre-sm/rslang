import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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
  fakeTranslate?: string,
  answer?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  public difficulty$ = new Subject<number>();

  public changeDifficulty(difficulty: number) {
    this.difficulty$.next(difficulty);
  }

  public result$ = new BehaviorSubject<any>(false);
  result = this.result$.asObservable();

  public sendResult(result: IWord[]) {
    this.result$.next(result);
  }
}
