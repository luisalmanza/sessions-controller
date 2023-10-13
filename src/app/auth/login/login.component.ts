import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthDataResponse } from '../models/auth-data-response.model';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authForm: FormGroup;
  loginError: string = "";

  get email(): AbstractControl {
    return this.authForm.get("email")!;
  }

  get password(): AbstractControl {
    return this.authForm.get("password")!;
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  onLogin() {
    const authData = { ...this.authForm.value };
    if (this.authForm.valid) {
      this.authService.login(authData).subscribe({
        next: (authResponse: AuthDataResponse) => {
          const data = { ...authResponse.data };
          this.authService.setToken(data.token);
          if (data.token) {
            const expiresInDuration = data.expiresIn;
            this.authService.setAuthTimer(expiresInDuration);
            this.authService.setAuthenticated(true);
            this.authService.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.authService.saveAuthData(data.token, expirationDate, data.user.role);
            if (data.user.role === "admin") {
              this.router.navigate(["/admin"]);
            } else {
              this.router.navigate(["/user"]);
            }
          }
        },
        error: error => {
          this.authService.authStatusListener.next(false);
          if (error.error.message) {
            this.loginError = error.error.message;
          } else {
            new Modal('#errorModal').show();
          }
        }
      })
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
