import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthData } from './models/auth-data.model';
import { HttpClient } from "@angular/common/http";
import { UserData } from './models/user-data.model';
import { AuthDataResponse } from './models/auth-data-response.model';
import { Router } from '@angular/router';
import { Subject } from "rxjs";

const BACKEND_URL = environment.apiUrl + "/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated: boolean = false;
  private token: string | undefined;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  createUser(userData: UserData) {
    return this.http.post(`${BACKEND_URL}/signup`, userData);
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(authData: AuthData) {
    this.http.post<AuthDataResponse>(`${BACKEND_URL}/login`, authData).subscribe({
      next: (authResponse: AuthDataResponse) => {
        const data = { ...authResponse.data };
        this.token = data.token;
        if (this.token) {
          const expiresInDuration = data.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.authenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, data.user.role);
          if (data.user.role === "admin") {
            this.router.navigate(["/admin"]);
          } else {
            this.router.navigate(["/user"]);
          }
        }
      },
      error: error => {
        this.authStatusListener.next(false);
      }
    })
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, role: string): void {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);
  }

  logout(): void {
    this.authenticated = false;
    this.token = undefined;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private clearAuthData(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.authenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      role
    };
  }
}
