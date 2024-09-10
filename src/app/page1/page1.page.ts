import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
})
export class Page1Page {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>; // อ้างอิงถึง element <video>

  constructor() {}

  toggleFullscreen() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      if (document.fullscreenElement) {
        document.exitFullscreen(); 
      } else {
        video.requestFullscreen(); 
      }
    }
  }
}