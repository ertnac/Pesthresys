import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantCollectionPage } from './plant-collection.page';

describe('PlantCollectionPage', () => {
  let component: PlantCollectionPage;
  let fixture: ComponentFixture<PlantCollectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlantCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
