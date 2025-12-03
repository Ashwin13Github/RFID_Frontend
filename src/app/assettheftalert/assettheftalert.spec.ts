import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Assettheftalert } from './assettheftalert';

describe('Assettheftalert', () => {
  let component: Assettheftalert;
  let fixture: ComponentFixture<Assettheftalert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assettheftalert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Assettheftalert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
