import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  public difficulty$ = new Subject<number>();

  public changeDifficulty(difficulty: number) {
    this.difficulty$.next(difficulty);
  }
}
