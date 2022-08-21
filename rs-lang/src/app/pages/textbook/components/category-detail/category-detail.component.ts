import { Component, OnInit, Input } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})

export class CategoryDetailComponent implements OnInit {

  @Input() category?: Category;

  constructor() { }

  ngOnInit(): void {
  }

}
