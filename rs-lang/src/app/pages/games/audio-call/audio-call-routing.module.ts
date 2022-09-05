import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioCallComponent } from './audio-call.component';

const routes: Routes = [{ path: '', component: AudioCallComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudioCallRoutingModule { }
