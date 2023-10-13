import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import checkPasswords from './passwords.validator';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  userForm: FormGroup;
  private registeredModal: Modal | undefined;

  get name(): AbstractControl {
    return this.userForm.get("name")!;
  }

  get email(): AbstractControl {
    return this.userForm.get("email")!;
  }

  get password(): AbstractControl {
    return this.userForm.get("password")!;
  }

  get confirmPassword(): AbstractControl {
    return this.userForm.get("confirmPassword")!;
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.userForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: [false],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    }, {
      validators: checkPasswords("password", "confirmPassword")
    });
  }

  ngOnInit(): void {
    this.registeredModal = new Modal('#registeredModal');
  }

  onSignup() {
    let userData = { ...this.userForm.value };
    if (this.userForm.valid && userData.password === userData.confirmPassword) {
      userData.role = userData.role ? "admin" : "user";
      delete userData.confirmPassword;
      this.authService.createUser(userData).subscribe({
        next: userResponse => {
          this.userForm.reset();
          this.registeredModal?.show();
        },
        error: error => {
          new Modal('#errorModal').show();
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onLogin() {
    this.registeredModal?.hide();
    this.router.navigate(["/login"]);
  }
}
