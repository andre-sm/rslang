import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Word } from '../../../models/word';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private wordsUrl = 'https://rss-rslang-be.herokuapp.com/words';

  constructor(private http: HttpClient) { }

  getWords(group: number, page: number): Observable<Word[]> {
    const queryParams = `?group=${group}&page=${page}`;
    const url = `${this.wordsUrl}${queryParams}`;
    return this.http.get<Word[]>(url);
  }
}
