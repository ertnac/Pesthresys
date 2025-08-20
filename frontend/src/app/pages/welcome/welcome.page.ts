// Update your component TypeScript
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { register } from 'swiper/element';
import Swiper from 'swiper';

register();
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  isLast: boolean = false;
  length: any = 0;
  index: any = 0;
  items: any[] = [];
  showModal: boolean = false; // Add this property to control modal visibility

  constructor(
    public util: UtilService
  ) {
    setTimeout(() => {
      this.length = this.swiper?.nativeElement.swiper.slides.length;
      this.items = [];
      for (let i = 0; i < this.length; i++) {
        this.items.push(i);
      }
    }, 1000);
  }

  ngOnInit() {
  }

  onSkip() {
    this.swiper?.nativeElement.swiper.slideTo(3);
  }

  onSign() {
    this.showModal = false; // Close modal before navigating
    setTimeout(() => {
      this.util.navigateToPage('/signin');
    }, 300); // Wait for modal animation to complete
  }

  onRegister() {
    this.showModal = false; // Close modal before navigating
    setTimeout(() => {
      this.util.navigateRoot('/signup');
    }, 300); // Wait for modal animation to complete
  }

  slideChanged(event: any) {
    this.index = this.swiper?.nativeElement.swiper.activeIndex;
    this.isLast = this.swiper?.nativeElement.swiper.isEnd ?? false;
  }
}