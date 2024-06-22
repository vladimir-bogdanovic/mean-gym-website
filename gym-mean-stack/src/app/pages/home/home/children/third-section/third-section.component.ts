import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LessonInterface } from './lesson.model';

@Component({
  selector: 'third-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './third-section.component.html',
  styleUrl: './third-section.component.scss',
})
export class ThirdSectionComponent implements OnInit {
  classes: LessonInterface[] = [
    {
      image: 'Running',
      url: '../../assets/home-thirdSection-running.jpg',
      trainers: 'Selina Stuart, Jenifer ALex',
    },
    {
      image: 'Cycling',
      url: '../assets/home-thirdSection-cycling.jpg',
      trainers: 'David Smith, John Doe',
    },
    {
      image: 'Meditation',
      url: '../assets/home-thirdSection-meditation.jpg',
      trainers: 'Jecy Doeho, David Fahim',
    },
    {
      image: 'Martial-arts',
      url: '../assets/home-thirdSection-martialArts.jpg',
      trainers: 'Selina Stuart, David Smith',
    },
    {
      image: 'Powerlifting',
      url: '../assets/home-thirdSection-powerlifting.jpg',
      trainers: 'Sendy',
    },
  ];

  currentIndex = 0;
  visibleImages: LessonInterface[] = [];

  ngOnInit(): void {
    this.updateVisibleImages();
  }

  updateVisibleImages() {
    this.visibleImages = [
      this.classes[this.currentIndex % 5], // First visible image
      this.classes[(this.currentIndex + 1) % 5], // Second visible image
      this.classes[(this.currentIndex + 2) % 5], // Third visible image
    ];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % 5;
    this.updateVisibleImages();
  }

  prev() {
    this.currentIndex = (this.currentIndex + 3 - 1) % 5;
    this.updateVisibleImages();
  }
}
