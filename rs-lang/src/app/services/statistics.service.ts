import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Statistics } from '../models/statistics';

const STATISTICS_URL = 'https://rss-rslang-be.herokuapp.com/users/';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private http: HttpClient, private storageService: StorageService) { }

  getUserStatistics(id: string): Observable<any> {
    return this.http.get(`${STATISTICS_URL}${id}/statistics`, {
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
}
