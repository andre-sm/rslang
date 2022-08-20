import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TextbookComponent } from './pages/textbook/textbook.component';
import { GamesComponent } from './pages/games/games.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { AudioCallComponent } from './pages/games/audio-call/audio-call.component';
import { SprintComponent } from './pages/games/sprint/sprint.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'textbook', component: TextbookComponent },
  { path: 'games', component: GamesComponent },
  { path: 'games/audio-call', component: AudioCallComponent },
  { path: 'games/sprint', component: SprintComponent },
  { path: 'statistics', component: StatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
