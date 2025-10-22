import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAt } from './people-at';

describe('PeopleAt', () => {
  let component: PeopleAt;
  let fixture: ComponentFixture<PeopleAt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleAt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleAt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
