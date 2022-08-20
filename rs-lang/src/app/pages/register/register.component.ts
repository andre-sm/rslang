import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';

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

  constructor(private authService: AuthService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
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
