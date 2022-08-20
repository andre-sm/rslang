import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioCallRoutingModule } from './audio-call-routing.module';
import { AudioCallComponent } from './audio-call.component';


@NgModule({
  declarations: [
    AudioCallComponent
  ],
  imports: [
    CommonModule,
    AudioCallRoutingModule
  ]
})
export class AudioCallModule { }
