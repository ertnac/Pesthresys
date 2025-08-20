/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : initPay This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PestHomePage } from './pest-home.page';

describe('HomePage', () => {
  let component: PestHomePage;
  let fixture: ComponentFixture<PestHomePage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(PestHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
