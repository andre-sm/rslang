import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { MatButtonModule } from '@angular/material/button';
import { DifficultyForm, DifficultyFormComponent } from './difficulty-form/difficulty-form.component';
import { ResultFormComponent } from './result-form/result-form.component';

@NgModule({
  declarations: [
    GamesComponent,
    DifficultyFormComponent,
    DifficultyForm,
    ResultFormComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    MatButtonModule
  ],
  exports: [
    DifficultyFormComponent,
    DifficultyForm,
    ResultFormComponent
  ]
})
export class GamesModule { }
