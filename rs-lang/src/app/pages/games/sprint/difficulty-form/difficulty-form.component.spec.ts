import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyFormComponent } from './difficulty-form.component';

describe('DifficultyFormComponent', () => {
  let component: DifficultyFormComponent;
  let fixture: ComponentFixture<DifficultyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifficultyFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifficultyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
