import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioCallRoutingModule } from './audio-call-routing.module';
import { AudioCallComponent } from './audio-call.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GamesModule } from '../games.module';

@NgModule({
  declarations: [
    AudioCallComponent,
  ],
  imports: [
    CommonModule,
    AudioCallRoutingModule,
    MatButtonModule,
    MatDialogModule,
    GamesModule,
    MatIconModule
  ]
})
export class AudioCallModule { }
