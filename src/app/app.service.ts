import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}

  public isAuthenticated(): boolean {
    console.log('here')
    this.username = localStorage.getItem('username');
    return !!this.username;
  }
  
  setUsername(name: string): void {
    this.username = name;
  }
  /** get all memebers */
  getMembers() {
    return this.http
      .get(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }
  /** get a member */
  getMember(memberId:String) {
    return this.http
      .get(`${this.api}/members/${memberId}`)
      .pipe(catchError(this.handleError));
  }
  /** create a member */
  addMember(mebmer) {
    return this.http
      .post(`${this.api}/members`, mebmer)
      .pipe(catchError(this.handleError));
  }
  /** update a member */
  updateMember(mebmer) {
    console.log('jj', mebmer)
    const memberId = mebmer.id;
    return this.http
      .put(`${this.api}/members/${memberId}`, mebmer)
      .pipe(catchError(this.handleError));
  }
  /** delete a member */
  removeMember(memberId) {
    return this.http
      .delete(`${this.api}/members/${memberId}`)
      .pipe(catchError(this.handleError));
  }
  /** get all teams */
  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
