import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SecondSectionComponent } from './children/second-section/second-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgStyle, NgClass, SecondSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  imageIndex: number = 0;
  interval!: number;

  slides = [
    { image: 'image1', url: '../assets/hero-image1.jpg' },
    { image: 'image2', url: '../assets/hero-image2.jpg' },
    { image: 'image3', url: '../assets/hero-image3.jpg' },
  ];

  ngOnInit(): void {
    this.resetInterval();
  }

  resetInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = window.setInterval(() => this.goToNext(), 5000);
  }

  goToPrevious() {
    this.resetInterval();
    if (this.imageIndex === 0) {
      this.imageIndex = 2;
    } else {
      this.imageIndex--;
    }
  }

  goToNext() {
    this.resetInterval();
    if (this.imageIndex === this.slides.length - 1) {
      this.imageIndex = 0;
    } else {
      this.imageIndex++;
    }
  }

  goToSlide(index: number) {
    this.resetInterval();
    this.imageIndex = index;
  }
}
