import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintRoutingModule } from './sprint-routing.module';
import { SprintComponent } from './sprint.component';
import { ResultFormComponent } from '../result-form/result-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GamesModule } from '../games.module';

@NgModule({
  declarations: [
    SprintComponent,
    ResultFormComponent
  ],
  imports: [
    CommonModule,
    SprintRoutingModule,
    MatButtonModule,
    MatDialogModule,
    GamesModule,
    MatTableModule,
    MatIconModule
  ]
})
export class SprintModule { }
