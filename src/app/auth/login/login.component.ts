import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.authForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  onLogin() {
    const authData = { ...this.authForm.value };
    if (this.authForm.valid) {
      this.authService.login(authData);
    }
  }
}
