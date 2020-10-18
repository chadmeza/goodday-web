import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string;
  private userStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    const user = { email: email, password: password };

    this.http.post<{ success: boolean, data: { token: string } }>(
      `${environment.apiUrl}/auth/login`, user
      )
      .subscribe(
        response => {
          const token = response.data.token;
          this.token = token;

          if (token) {
            this.isAuthenticated = true;
            this.userStatusListener.next(true);
            this.saveUserData(token);

            this.router.navigate(["/"]);
          }
        },
        error => {
          this.userStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userStatusListener.next(false);

    this.deleteUserData();

    this.router.navigate(["/login"]);
  }

  autoLogin() {
    const userData = this.getUserData();

    if (!userData) {
      return;
    }

    this.token = userData.token;
    this.isAuthenticated = true;
    this.userStatusListener.next(true);
  }

  private saveUserData(token: string) {
    localStorage.setItem("token", token);
  }

  private deleteUserData() {
    localStorage.removeItem("token");
  }

  private getUserData() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    
    return {
      token: token
    };
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }
}
