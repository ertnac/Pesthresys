import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileActionsPage } from './profile-actions.page';

describe('ProfileActionsPage', () => {
  let component: ProfileActionsPage;
  let fixture: ComponentFixture<ProfileActionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
