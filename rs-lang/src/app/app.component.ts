import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;
  username?: string;

  constructor(private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      if (user) {
        this.username = user.name;
      }
    }
  }

  logout(): void {
    this.storageService.clean()
    this.isLoggedIn = false;
    this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });
  }
}
