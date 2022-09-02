import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable( {providedIn: 'root'} )
export class FooterService {
  private visible = new BehaviorSubject(true);
  visible$ = this.visible.asObservable();
  show() {
    this.visible.next(true);
  }

  hide() {
    this.visible.next(false);
  }
}