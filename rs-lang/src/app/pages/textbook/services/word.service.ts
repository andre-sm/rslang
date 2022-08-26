import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Word } from '../models/word.model';
import { UserWord } from '../models/user-word.model';
import { UserWordResponse } from '../models/user-word-response.model';
import { UserAggregatedWord } from '../models/user-aggregated-word.model';
import { UserAggregatedWordResponse } from '../models/user-aggregated-word-response.model';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

  constructor(private http: HttpClient) {}

  getWords(group: number, page: number): Observable<Word[]> {
    const queryParams = `?group=${group}&page=${page}`;
    const url = `${this.BASE_URL}words${queryParams}`;
    return this.http.get<Word[]>(url);
  }

  getUserWords(userId: string): Observable<UserWord[]> {
    const queryParams = `users/${userId}/words`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.get<UserWord[]>(url);
  }

  getUserAggregatedWords(
    userId: string,
    group: number,
    page: number,
    perPage: number
  ): Observable<UserAggregatedWordResponse[]> {
    const queryParams = `users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${perPage}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.get<UserAggregatedWordResponse[]>(url);
  }

  getUserAggregatedHardWords(userId: string): Observable<UserAggregatedWordResponse[]> {
    const queryParams = `users/${userId}/aggregatedWords?filter={"userWord.difficulty":"hard"}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.get<UserAggregatedWordResponse[]>(url);
  }

  addToLearned(userId: string, wordId: string | undefined, params: UserWord): Observable<UserWordResponse> {
    const queryParams = `users/${userId}/words/${wordId}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.post<UserWordResponse>(url, params);
  }

  addToHard(userId: string, wordId: string | undefined, params: UserWord): Observable<UserWordResponse> {
    const queryParams = `users/${userId}/words/${wordId}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.post<UserWordResponse>(url, params);
  }

  updateUserWord(userId: string, wordId: string | undefined, params: UserWord): Observable<UserWordResponse> {
    const queryParams = `users/${userId}/words/${wordId}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.put<UserWordResponse>(url, params);
  }

  deleteUserWord(userId: string, wordId: string | undefined): Observable<UserWordResponse> {
    const queryParams = `users/${userId}/words/${wordId}`;
    const url = `${this.BASE_URL}${queryParams}`;
    return this.http.delete<UserWordResponse>(url);
  }
}
