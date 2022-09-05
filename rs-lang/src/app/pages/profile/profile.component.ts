import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoaded = false;
  userId: string | undefined = '';
  userData: UserProfile = {
    id: '',
    name: '',
    email: ''
  };
  errorMessage = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userId = this.storageService.getUser()?.userId;
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: (data: UserProfile) => {
          this.userData = structuredClone(data);
          this.isLoaded = true;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.toastr.error(this.errorMessage);
        }
      })
    }
  }

  onDelete(): void {
    this.userId = this.storageService.getUser()?.userId;
    if (this.userId) {
      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          this.logout();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.toastr.error(this.errorMessage);
        }
      })
    }
  }

  logout(): void {
    this.storageService.clean();
    this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });
  }

  ngOnDestroy(): void {
    this.isLoaded = false;
  }
}
