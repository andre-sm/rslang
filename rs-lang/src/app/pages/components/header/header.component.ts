import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isLoggedIn?: boolean;
  @Input() userName?: string;
  @Output() logoutClick = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  logout(): void {
    this.logoutClick.emit();
  }

}
