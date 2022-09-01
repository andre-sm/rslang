import { Component, OnInit } from '@angular/core';
import { SprintGameService } from '../../../services/sprintgame.service';
import { Word } from '../../../models/words';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  results: Word[] = [];
  constructor(private sprintGameService: SprintGameService) { }

  ngOnInit(): void {
    this.sprintGameService.result$.subscribe((results) => {
      this.results = results;
    });
  }

  playSound(soundLink: string) {
    const sound = new Audio(`${BASE_URL}${soundLink}`);
    sound.play();
  }

}
