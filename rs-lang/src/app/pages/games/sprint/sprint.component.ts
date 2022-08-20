import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.getWords();
  }

  async getWords(): Promise<void> {
    const words = await fetch('https://rss-rslang-be.herokuapp.com/words?group=0&page=29');
    console.log(await words.json());
  }

}
