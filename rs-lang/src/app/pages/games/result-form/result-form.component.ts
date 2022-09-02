import { Component, OnInit, Inject } from '@angular/core';
import { SprintGameService } from '../../../services/sprintgame.service';
import { Word } from '../../../models/words';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss'],
})
export class ResultFormComponent implements OnInit {
  results: Word[] = [];
  constructor(
    private sprintGameService: SprintGameService,
    @Inject(MAT_DIALOG_DATA) public data: { score: number },
    private matDialogRef: MatDialogRef<ResultFormComponent>
  ) {}

  ngOnInit(): void {
    this.sprintGameService.result$.subscribe((results) => {
      this.results = results;
    });
  }

  playSound(soundLink: string) {
    const sound = new Audio(`${BASE_URL}${soundLink}`);
    sound.play();
  }

  onRepeat() {
    this.matDialogRef.close(true);
  }
}