import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { TextbookComponent } from './pages/textbook/textbook.component';
import { GamesComponent } from './pages/games/games.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MainComponent } from './pages/main/main.component';
import { AudioCallComponent } from './pages/games/audio-call/audio-call.component';
import { SprintComponent } from './pages/games/sprint/sprint.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TextbookComponent,
    GamesComponent,
    StatisticsComponent,
    MainComponent,
    AudioCallComponent,
    SprintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
