import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { authInterceptorProviders } from './helpers/auth.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TextbookComponent } from './pages/textbook/textbook.component';
import { GamesComponent } from './pages/games/games.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MainComponent } from './pages/main/main.component';
import { AudioCallComponent } from './pages/games/audio-call/audio-call.component';
import { SprintComponent } from './pages/games/sprint/sprint.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TextbookComponent,
    GamesComponent,
    StatisticsComponent,
    MainComponent,
    AudioCallComponent,
    SprintComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
