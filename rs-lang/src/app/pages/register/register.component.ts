import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: User = {
    name: '',
    email: '',
    password: ''
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    const { name, email, password } = this.form;
    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login'])
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        if (err.status === 403 || err.status === 422) {
          this.toastr.error('Incorrect e-mail or password');
        } else if (err.status === 417) {
          this.toastr.error('User with this e-mail exists');
        } else {
          this.toastr.error(this.errorMessage);
        }
        this.isSignUpFailed = true;
      }
    });
  }
}
