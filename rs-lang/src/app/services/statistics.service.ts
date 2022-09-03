import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { StatisticByDate, Statistics, defaultStatistics, stringifiedNewBody } from '../models/statistics.model';
import { UserAggregatedWord } from '../models/user-aggregated-word.model';
import { getUniqueWords, isToday } from '../utils/statistics';

const STATISTICS_URL = 'https://rss-rslang-be.herokuapp.com/users/';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private getUserStatisticsResponse: stringifiedNewBody | null = null;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getUserStatistics(id: string): Observable<any> {
    return this.http.get<stringifiedNewBody>(`${STATISTICS_URL}${id}/statistics`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.getToken()}`
      })
    })
  }

  updateUserStatistics(id: string, statistics: stringifiedNewBody): Observable<any> {
    return this.http.put(`${STATISTICS_URL}${id}/statistics`, statistics, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.getToken()}`
      })
    })
  }

  setUserStatistics(rightAnswers: UserAggregatedWord[], wrongAnswers: UserAggregatedWord[], bestStreak: number, rightPercent: number, gameName: string) {
    const userId: string | undefined = this.storageService.getUser()?.userId;
    const token: string | null = this.storageService.getToken();
    if (userId && token) {
      this.getUserStatistics(userId).subscribe({
        next: (data: stringifiedNewBody) => {
          this.getUserStatisticsResponse = data;
          if (this.getUserStatisticsResponse) {
            const oldStatistics: stringifiedNewBody = structuredClone(this.getUserStatisticsResponse);
            const newStatistics: Statistics = {
              learnedWords: oldStatistics.learnedWords,
              optional: {
                allStatisticsByDate: JSON.parse(oldStatistics.optional.allStatisticsByDate),
                wordsList: JSON.parse(oldStatistics.optional.wordsList)
              }
            };
            this.upsertUserStatistics(newStatistics, rightAnswers, wrongAnswers, bestStreak, rightPercent, gameName);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) this.upsertUserStatistics(defaultStatistics, rightAnswers, wrongAnswers, bestStreak, rightPercent, gameName);
        }
      });
    }
  }

  upsertUserStatistics(oldbody: Statistics, rightAnswers: UserAggregatedWord[], wrongAnswers: UserAggregatedWord[], bestStreak: number, rightPercent: number, gameName: string) {
    const userId: string | undefined = this.storageService.getUser()?.userId;
    const token: string | null = this.storageService.getToken();
    if (userId && token) {
      const newBody = structuredClone(oldbody);
      const allGameWords = [...rightAnswers, ...wrongAnswers];
      if (newBody.learnedWords === 0) { // if no statistics, then create statistics
        newBody.learnedWords = allGameWords.length;
        newBody.optional.allStatisticsByDate[0].date = new Date();
        newBody.optional.allStatisticsByDate[0].allWords = allGameWords.length;
        newBody.optional.allStatisticsByDate[0].allNewWords = allGameWords.length;
        newBody.optional.allStatisticsByDate[0].allGamesRight = rightAnswers.length;
        newBody.optional.allStatisticsByDate[0].allGamesRightPercent = rightPercent;
        newBody.optional.allStatisticsByDate[0].allGamesWrong = wrongAnswers.length;
        newBody.optional.allStatisticsByDate[0].wordsList = allGameWords.map(item => item._id as string);
        if (gameName === 'sprint') {
          newBody.optional.allStatisticsByDate[0].games.sprint.right = rightAnswers.length;
          newBody.optional.allStatisticsByDate[0].games.sprint.rightPercent = rightPercent;
          newBody.optional.allStatisticsByDate[0].games.sprint.wrong = wrongAnswers.length;
          newBody.optional.allStatisticsByDate[0].games.sprint.bestStreak = bestStreak;
          newBody.optional.allStatisticsByDate[0].games.sprint.newWords = allGameWords.length;
          newBody.optional.allStatisticsByDate[0].games.sprint.wordsList = allGameWords.map(item => item._id as string);
        } else if (gameName === 'audioCall') {
          newBody.optional.allStatisticsByDate[0].games.audioCall.right = rightAnswers.length;
          newBody.optional.allStatisticsByDate[0].games.audioCall.rightPercent = rightPercent;
          newBody.optional.allStatisticsByDate[0].games.audioCall.wrong = wrongAnswers.length;
          newBody.optional.allStatisticsByDate[0].games.audioCall.bestStreak = bestStreak;
          newBody.optional.allStatisticsByDate[0].games.audioCall.newWords = allGameWords.length;
          newBody.optional.allStatisticsByDate[0].games.audioCall.wordsList = allGameWords.map(item => item._id as string);
        }
        newBody.optional.wordsList = allGameWords.map(item => item._id as string);
      } else { // if there is some statistics of user
        const lastAllStatisticsByDateItem = newBody.optional.allStatisticsByDate.length; // last user statistic
        if (isToday(new Date(newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].date))) {
          if (gameName === 'sprint') {
            const uniqueWordsArray = getUniqueWords(
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.wordsList,
              allGameWords.map(item => item._id as string)
            );
            if (uniqueWordsArray.length) {
              newBody.learnedWords += uniqueWordsArray.length;

              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allWords += uniqueWordsArray.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allNewWords += uniqueWordsArray.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight += rightAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRightPercent =
                Number(
                  ((newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight + rightAnswers.length)
                  / (
                    (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight + rightAnswers.length)
                    + (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesWrong + wrongAnswers.length)
                  ) * 100).toFixed(0)
                );
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesWrong += wrongAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].wordsList = [
                ...newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].wordsList,
                ...uniqueWordsArray
              ];

              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.right += rightAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.rightPercent =
                Number(
                  ((newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.right + rightAnswers.length)
                  / (
                    (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.right + rightAnswers.length)
                    + (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.wrong + wrongAnswers.length)
                  ) * 100).toFixed(0)
                );
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.wrong += wrongAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.bestStreak =
                newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.bestStreak < bestStreak
                ? bestStreak : newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.bestStreak;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.newWords += uniqueWordsArray.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.wordsList = [
                ...newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.sprint.wordsList,
                ...uniqueWordsArray
              ];

              newBody.optional.wordsList = [
                ...newBody.optional.wordsList,
                ...uniqueWordsArray,
              ]
            }
          } else if (gameName === 'audioCall') {
            const uniqueWordsArray = getUniqueWords(
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.wordsList,
              allGameWords.map(item => item._id as string)
            );
            if (uniqueWordsArray.length) {
              newBody.learnedWords += uniqueWordsArray.length;

              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allWords += uniqueWordsArray.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allNewWords += uniqueWordsArray.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight += rightAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRightPercent =
                Number(
                  ((newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight + rightAnswers.length)
                  / (
                    (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesRight + rightAnswers.length)
                    + (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesWrong + wrongAnswers.length)
                  ) * 100).toFixed(0)
                );
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allGamesWrong += wrongAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].wordsList = [
                ...newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].wordsList,
                ...uniqueWordsArray
              ];

              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.right += rightAnswers.length;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.rightPercent =
                Number(
                  ((newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.right + rightAnswers.length)
                  / (
                    (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.right + rightAnswers.length)
                    + (newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.wrong + wrongAnswers.length)
                  ) * 100).toFixed(0)
                );
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.wrong += wrongAnswers.length ;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.bestStreak =
                newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.bestStreak < bestStreak
                ? bestStreak : newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.bestStreak;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.newWords += uniqueWordsArray.length ;
              newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.wordsList = [
                ...newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].games.audioCall.wordsList,
                ...uniqueWordsArray
              ];

              newBody.optional.wordsList = [
                ...newBody.optional.wordsList,
                ...uniqueWordsArray,
              ]
            }
          }
          // console.log('newBody isToday', newBody);
        } else {
          const uniqueWordsArray = getUniqueWords(
            newBody.optional.wordsList,
            allGameWords.map(item => item._id as string)
          );
          if (uniqueWordsArray.length) {
            newBody.learnedWords += uniqueWordsArray.length;
            const lastAllWords = newBody.optional.allStatisticsByDate[lastAllStatisticsByDateItem - 1].allWords;
            const lastAllNewWords = uniqueWordsArray.length;
            const newStatisticByDateItem: StatisticByDate = {
              date: new Date(),
              allWords: lastAllWords + uniqueWordsArray.length,
              allNewWords: lastAllNewWords,
              allGamesRight: rightAnswers.length,
              allGamesRightPercent: rightPercent,
              allGamesWrong: wrongAnswers.length,
              wordsList: [...uniqueWordsArray],
              games: {
                sprint: {
                  right: 0,
                  rightPercent: 0,
                  wrong: 0,
                  bestStreak: 0,
                  newWords: 0,
                  wordsList: []
                },
                audioCall: {
                  right: 0,
                  rightPercent: 0,
                  wrong: 0,
                  bestStreak: 0,
                  newWords: 0,
                  wordsList: []
                }
              }
            }
            if (gameName === 'sprint') {
              newStatisticByDateItem.games.sprint.right = rightAnswers.length;
              newStatisticByDateItem.games.sprint.rightPercent = rightPercent;
              newStatisticByDateItem.games.sprint.wrong = wrongAnswers.length;
              newStatisticByDateItem.games.sprint.bestStreak = bestStreak;
              newStatisticByDateItem.games.sprint.newWords = uniqueWordsArray.length;
              newStatisticByDateItem.games.sprint.wordsList = [...uniqueWordsArray];
            } else if (gameName === 'audioCall') {
              newStatisticByDateItem.games.audioCall.right = rightAnswers.length;
              newStatisticByDateItem.games.audioCall.rightPercent = rightPercent;
              newStatisticByDateItem.games.audioCall.wrong = wrongAnswers.length;
              newStatisticByDateItem.games.audioCall.bestStreak = bestStreak;
              newStatisticByDateItem.games.audioCall.newWords = uniqueWordsArray.length;
              newStatisticByDateItem.games.audioCall.wordsList = [...uniqueWordsArray];
            }
            newBody.optional.allStatisticsByDate = [...newBody.optional.allStatisticsByDate, newStatisticByDateItem]
            const lastWordsList = [
              ...newBody.optional.wordsList,
              ...uniqueWordsArray,
            ];
            newBody.optional.wordsList = [...lastWordsList];
          }
          // console.log('newBody notToday', newBody);
        }
      }
      const stringifiedNewBody: stringifiedNewBody = {
        learnedWords: newBody.learnedWords,
        optional: {
          allStatisticsByDate: JSON.stringify(newBody.optional.allStatisticsByDate),
          wordsList: JSON.stringify(newBody.optional.wordsList)
        }
      }
      // console.log('newBody Updated', newBody);
      // console.log('newBody Stringified', stringifiedNewBody);
      this.updateUserStatistics(userId, stringifiedNewBody).subscribe();
    }
  }
}
