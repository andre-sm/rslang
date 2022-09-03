import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SprintGameService } from '../../../services/sprintgame.service';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

let dialogRef;
const DELAY_FORM_CLOSE = 1000;

@Component({
  selector: 'difficulty-form',
  templateUrl: './dialog-animations-example.html',
})

export class DifficultyForm implements OnInit {

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    dialogRef = this.dialog.open(DifficultyFormComponent, {
      width: '400px',
      disableClose: true,
      panelClass: 'difficulty-dialog-class'
    });
  }

}

@Component({
  selector: 'app-difficulty-form',
  templateUrl: './difficulty-form.component.html',
  styleUrls: ['./difficulty-form.component.scss']
})

export class DifficultyFormComponent implements OnInit, AfterViewChecked {

  categories?: Category[];
  categoriesElements?: NodeListOf<Element>;

  constructor(
    public dialogRef: MatDialogRef<DifficultyFormComponent>, 
    private sprintGameService: SprintGameService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewChecked(): void {
    this.categoriesElements = document.querySelectorAll('.category-btn');
  }

  public closeDialog(number: number) {
    this.sprintGameService.changeDifficulty(number);
    setTimeout(() => {
      this.dialogRef.close();
    }, DELAY_FORM_CLOSE);
  }

  getCategories(): void {
    this.categories = this.categoryService.getCategories();
  }

  moveFocus(e: KeyboardEvent) {
    const activeBtn = document.activeElement;
    const activeEleIndex = Array.prototype.indexOf.call(this.categoriesElements, activeBtn);
    const categoriesLength = this.categoriesElements?.length;

    if (categoriesLength) {
      if (e.key === "ArrowRight" && activeEleIndex < categoriesLength - 1 ) {
        (activeBtn?.nextElementSibling as HTMLElement).focus();
      } 
  
      if (e.key === "ArrowLeft" && activeEleIndex > 0) {
        (activeBtn?.previousElementSibling as HTMLElement).focus();
      }
    }
  }

}
