import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveReports } from './active-reports';

describe('ActiveReports', () => {
  let component: ActiveReports;
  let fixture: ComponentFixture<ActiveReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
