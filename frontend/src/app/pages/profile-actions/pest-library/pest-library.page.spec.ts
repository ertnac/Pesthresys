import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PestLibraryPage } from './pest-library.page';

describe('PestLibraryPage', () => {
  let component: PestLibraryPage;
  let fixture: ComponentFixture<PestLibraryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PestLibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
