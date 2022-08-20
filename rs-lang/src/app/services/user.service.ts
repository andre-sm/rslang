import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const USERS_URL = 'https://rss-rslang-be.herokuapp.com/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<any> {
    return this.http.get(`${USERS_URL}${id}`, httpOptions)
  }

  updateUser(id: string, email: string, password: string): Observable<any> {
    return this.http.put(`${USERS_URL}${id}`, { email, password }, httpOptions);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${USERS_URL}${id}`);
  }
}
