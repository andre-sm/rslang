import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';

const routes: Routes = [
  { path: '', component: GamesComponent },
  { path: 'audio-call', loadChildren: () => import('./audio-call/audio-call.module').then(m => m.AudioCallModule) },
  { path: 'sprint', loadChildren: () => import('./sprint/sprint.module').then(m => m.SprintModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
