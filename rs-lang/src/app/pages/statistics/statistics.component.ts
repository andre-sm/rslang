import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StatisticsService } from '../../services/statistics.service';
import { StorageService } from '../../services/storage.service';
import { Statistics, stringifiedNewBody, TodayStatistics, TodayStatisticsGame } from '../../models/statistics';
import { isToday } from './../../utils/statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  userId: string | undefined = ''
  errorMessage = '';
  statisticsData: Statistics = {
    learnedWords: 0,
    optional: {
      allStatisticsByDate: [],
      wordsList: []
    }
  }
  todayStatistics: TodayStatistics = {
    allNewWords: 0,
    allGamesRightPercent: 0
  }
  todayStatisticsSprint: TodayStatisticsGame = {
    newWords: 0,
    rightPercent: 0,
    bestStreak: 0
  }
  todayStatisticsAudioCall: TodayStatisticsGame = {
    newWords: 0,
    rightPercent: 0,
    bestStreak: 0
  }

  constructor(
    private statisticsService: StatisticsService,
    private storageService: StorageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userId = this.storageService.getUser()?.userId
    if (this.userId) {
      this.statisticsService.getUserStatistics(this.userId).subscribe({
        next: (data: stringifiedNewBody) => {
          this.statisticsData = {
            learnedWords: data.learnedWords,
            optional: {
              allStatisticsByDate: JSON.parse(data.optional.allStatisticsByDate),
              wordsList: JSON.parse(data.optional.wordsList)
            }
          };
          console.log(this.statisticsData);
          if (
            isToday(new Date(
              this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].date
            ))
          ) {
            this.todayStatistics.allNewWords = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].allNewWords;
            this.todayStatistics.allGamesRightPercent = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].allGamesRightPercent;
            this.todayStatisticsSprint.newWords = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.sprint.newWords;
            this.todayStatisticsSprint.rightPercent = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.sprint.rightPercent;
            this.todayStatisticsSprint.bestStreak = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.sprint.bestStreak;
            this.todayStatisticsAudioCall.newWords = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.audioCall.newWords;
            this.todayStatisticsAudioCall.rightPercent = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.audioCall.rightPercent;
            this.todayStatisticsAudioCall.bestStreak = this.statisticsData.optional.allStatisticsByDate[this.statisticsData.optional.allStatisticsByDate.length - 1].games.audioCall.bestStreak;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.toastr.error(this.errorMessage);
        }
      })
    }
  }

}
