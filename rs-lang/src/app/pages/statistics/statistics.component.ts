import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StatisticsService } from '../../services/statistics.service';
import { StorageService } from '../../services/storage.service';
import { Statistics } from '../../models/statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  userId: string | undefined = ''
  errorMessage = '';
  statisticsData: Statistics | null = {
    learnedWords: 0,
    optional: {
      allStatisticsByDate: [],
      wordsList: []
    }
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
        next: (data) => {
          this.statisticsData = data.body;
          console.log(this.statisticsData);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.toastr.error(this.errorMessage);
        }
      })
    }
  }

}
