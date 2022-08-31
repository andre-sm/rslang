import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SprintGameService } from '../../../services/sprintgame.service';

let dialogRef;
const DELAY_FORM_CLOSE = 1000;

@Component({
  selector: 'difficulty-form',
  templateUrl: './dialog-animations-example.html',
})

export class DifficultyForm implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog('0ms', '0ms');
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    dialogRef = this.dialog.open(DifficultyFormComponent, {
      width: '480px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }

}

@Component({
  selector: 'app-difficulty-form',
  templateUrl: './difficulty-form.component.html',
  styleUrls: ['./difficulty-form.component.scss']
})

export class DifficultyFormComponent {

  constructor(
    public dialogRef: MatDialogRef<DifficultyFormComponent>, 
    private sprintGameService: SprintGameService
  ) {}

  public closeDialog(number: number) {
    this.sprintGameService.changeDifficulty(number);
    setTimeout(() => {
      this.dialogRef.close();
    }, DELAY_FORM_CLOSE);
  }
}
