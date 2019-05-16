import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakepicturePage } from './takepicture.page';

describe('TakepicturePage', () => {
  let component: TakepicturePage;
  let fixture: ComponentFixture<TakepicturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakepicturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakepicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
