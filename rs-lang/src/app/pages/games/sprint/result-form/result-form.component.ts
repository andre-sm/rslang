import { Component, OnInit } from '@angular/core';
import { DifficultyService } from '../../../../services/difficulty.service';

const BASE_URL = 'https://rss-rslang-be.herokuapp.com/';

interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string,
  fakeTranslate?: string,
  answer?: boolean
}

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  result: IWord[] = [];
  constructor(private difficultyService: DifficultyService) { }

  ngOnInit(): void {
    this.difficultyService.result$.subscribe((result) => {
      this.result = result;
    });

    console.log(this.result);
  }

  playSound(soundLink: string) {
    const sound = new Audio(`${BASE_URL}${soundLink}`);
    sound.play();
  }

}
