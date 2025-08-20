import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailedHistoryPage } from './detailed-history.page';

describe('DetailedHistoryPage', () => {
  let component: DetailedHistoryPage;
  let fixture: ComponentFixture<DetailedHistoryPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(DetailedHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
