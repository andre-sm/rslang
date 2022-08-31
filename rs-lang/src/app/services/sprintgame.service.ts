import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Word } from '../models/words';

@Injectable({
  providedIn: 'root'
})
export class SprintGameService {
  public difficulty$ = new Subject<number>();

  public changeDifficulty(difficulty: number) {
    this.difficulty$.next(difficulty);
  }

  public result$ = new BehaviorSubject<any>(false);
  result = this.result$.asObservable();

  public sendResult(result: Word[]) {
    this.result$.next(result);
  }
}
