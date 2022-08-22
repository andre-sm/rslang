import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-textbook',
  templateUrl: './textbook.component.html',
  styleUrls: ['./textbook.component.scss']
})
export class TextbookComponent implements OnInit {

  public category: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onCategoryChanged(category: number) {
    this.category = category;
  }
}
