import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSummaryComponent } from './month-summary.component';

describe('MonthSummaryComponent', () => {
  let component: MonthSummaryComponent;
  let fixture: ComponentFixture<MonthSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
