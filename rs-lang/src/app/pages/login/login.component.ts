import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { UserTokenResponse, LoginUser } from './../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: LoginUser = {
    email: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private storageService: StorageService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login({ email, password }).subscribe({
      next: (data: UserTokenResponse) => {
        this.storageService.saveToken(data.token)
        this.storageService.saveRefreshToken(data.refreshToken)
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.navigateAndReload();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        if (err.status === 403) {
          this.toastr.error('Incorrect e-mail or password');
        } else {
          this.toastr.error(this.errorMessage);
        }
        this.isLoginFailed = true;
      }
    });
  }

  navigateAndReload(): void {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
