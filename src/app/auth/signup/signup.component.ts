import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.userForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      confirmPassword: ["", Validators.required]
    });
  }

  onSignup() {
    let userData = { ...this.userForm.value };
    if (this.userForm.valid && userData.password === userData.confirmPassword) {
      delete userData.confirmPassword;
      this.authService.createUser(userData).subscribe({
        next: userResponse => {
          console.log(userResponse);
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }
}
