import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintRoutingModule } from './sprint-routing.module';
import { SprintComponent } from './sprint.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { GamesModule } from '../games.module';

@NgModule({
  declarations: [
    SprintComponent
  ],
  imports: [
    CommonModule,
    SprintRoutingModule,
    MatButtonModule,
    MatDialogModule,
    GamesModule
  ]
})
export class SprintModule { }
