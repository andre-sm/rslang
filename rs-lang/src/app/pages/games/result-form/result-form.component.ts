import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { SprintGameService } from '../../../services/sprintgame.service';
import { Word } from '../../../models/words.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss'],
})
export class ResultFormComponent implements OnInit, AfterViewChecked {
  results: Word[] = [];
  resultBtns?: NodeListOf<Element>;

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

  ngAfterViewChecked(): void {
    this.resultBtns = document.querySelectorAll('.result-btn');
  }

  playSound(soundLink: string) {
    const sound = new Audio(`${BASE_URL}${soundLink}`);
    sound.play();
  }

  onRepeat() {
    this.matDialogRef.close(true);
  }

  moveFocus(e: KeyboardEvent) {
    const activeBtn = document.activeElement;
    const activeBtnIndex = Array.prototype.indexOf.call(this.resultBtns, activeBtn);
    const resultBtnsLength = this.resultBtns?.length;

    if (resultBtnsLength) {
      if (e.key === "ArrowRight" && activeBtnIndex < resultBtnsLength - 1 ) {
        (activeBtn?.nextElementSibling as HTMLElement).focus();
      }

      if (e.key === "ArrowLeft" && activeBtnIndex > 0) {
        (activeBtn?.previousElementSibling as HTMLElement).focus();
      }
    }
  }
}
