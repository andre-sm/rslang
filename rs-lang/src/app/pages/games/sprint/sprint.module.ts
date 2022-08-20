import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SprintRoutingModule } from './sprint-routing.module';
import { SprintComponent } from './sprint.component';


@NgModule({
  declarations: [
    SprintComponent
  ],
  imports: [
    CommonModule,
    SprintRoutingModule
  ]
})
export class SprintModule { }
