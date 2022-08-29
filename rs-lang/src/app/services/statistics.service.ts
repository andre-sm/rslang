import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { StatisticByDate, Statistics, defaultStatistics } from '../models/statistics';
import { Word } from '../models/words';
import { getUniqueWords, isToday } from '../utils/statistics';

const STATISTICS_URL = 'https://rss-rslang-be.herokuapp.com/users/';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private getUserStatisticsResponse: HttpResponse<Statistics> | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getUserStatistics(id: string): Observable<HttpResponse<Statistics>> {
    return this.http.get<Statistics>(`${STATISTICS_URL}${id}/statistics`, {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.getToken()}`
      })
    })
  }

  updateUserStatistics(id: string, statistics: Statistics): Observable<any> {
    return this.http.put(`${STATISTICS_URL}${id}/statistics`, statistics, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.getToken()}`
      })
    })
  }

  setUserStatistics(rightAnswers: Word[], wrongAnswers: Word[]) {
    const userId: string | undefined = this.storageService.getUser()?.userId;
    const token: string | null = this.storageService.getToken();
    if (userId && token) {
      this.getUserStatistics(userId).subscribe({
        next: (data) => {
          this.getUserStatisticsResponse = JSON.parse(JSON.stringify(data));
          console.log('this.getUserStatisticsResponse', this.getUserStatisticsResponse);
        }
      });
      if (this.getUserStatisticsResponse !== null && this.getUserStatisticsResponse.ok) {
        const newStatistics: Statistics = {
          learnedWords: this.getUserStatisticsResponse.body?.learnedWords as number,
          optional: {
            allStatisticsByDate: this.getUserStatisticsResponse.body!.optional.allStatisticsByDate,
            wordsList: this.getUserStatisticsResponse.body!.optional.wordsList
          }
        }
        this.upsertUserStatistics(newStatistics, rightAnswers, wrongAnswers);
      } else {
        this.upsertUserStatistics(undefined, rightAnswers, wrongAnswers);
      }
    }
  }

  upsertUserStatistics(oldbody: Statistics = defaultStatistics, rightAnswers: Word[], wrongAnswers: Word[]) {
    const userId: string | undefined = this.storageService.getUser()?.userId;
    const token: string | null = this.storageService.getToken();
    console.log('oldbody', oldbody);
    if (userId && token) {
      const newBody: Statistics = JSON.parse(JSON.stringify(oldbody));
      const allGameWords = [...rightAnswers, ...wrongAnswers];
      if (newBody.learnedWords === 0) {
        newBody.learnedWords = allGameWords.length;
        newBody.optional.allStatisticsByDate[0].date = new Date();
        newBody.optional.allStatisticsByDate[0].newWords = allGameWords.length;
        newBody.optional.allStatisticsByDate[0].allWords = allGameWords.length;
        newBody.optional.wordsList = allGameWords.map(item => item.id);
      } else {
        const lastAllStatisticsByDateItem = newBody.optional.allStatisticsByDate.length;
        if (isToday(new Date(newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].date))) {
          const uniqWordsArray = getUniqueWords(newBody.optional.wordsList, allGameWords.map(item => item.id));
          if (uniqWordsArray.length) {
            newBody.learnedWords += uniqWordsArray.length;
            newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allWords += uniqWordsArray.length;
            newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].newWords += uniqWordsArray.length;
            newBody.optional.wordsList = [
              ...newBody.optional.wordsList,
              ...uniqWordsArray,
            ]
          }
        } else {
          const uniqWordsArray = getUniqueWords(newBody.optional.wordsList, allGameWords.map(item => item.id));
          if (uniqWordsArray.length) {
            newBody.learnedWords += uniqWordsArray.length;
            const lastAllWords = newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allWords;
            const lastNewWords = uniqWordsArray.length;
            const lastWordsList = [
              ...newBody.optional.wordsList,
              ...uniqWordsArray,
            ];
            newBody.optional.wordsList = [...lastWordsList];
            const newStatisticByDateItem: StatisticByDate = {
              date: new Date(),
              newWords: lastNewWords,
              allWords: lastAllWords + uniqWordsArray.length
            }
            newBody.optional.allStatisticsByDate = [...newBody.optional.allStatisticsByDate, newStatisticByDateItem]
          }
        }
      }
      console.log('userId', userId);
      console.log('newBody', newBody);
      this.updateUserStatistics(userId, newBody);
    }
  }
}
