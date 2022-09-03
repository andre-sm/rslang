import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from './services/storage.service';
import { EventBusService } from './shared/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;
  username?: string;
  eventBusSub?: Subscription;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private eventBusService: EventBusService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      if (user) {
        this.username = user.name;
      }
    }
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    })
  }

  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
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
