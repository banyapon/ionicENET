import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
})
export class Page2Page implements AfterViewInit {
  @ViewChild('map') mapRef: ElementRef | undefined;
  map: google.maps.Map | undefined; 
  // เปลี่ยน type เป็น google.maps.Map

  constructor() {}

  ngAfterViewInit() {
    this.loadMapScript().then(() => {
      this.createMap();
    });
  }

  private loadMapScript(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.mapsKey}&libraries=&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  createMap() {
    // สร้างแผนที่โดยใช้ Google Maps JavaScript API
    this.map = new google.maps.Map(this.mapRef?.nativeElement, {
      center: {
        lat: 13.7563, 
        lng: 100.5018 
      },
      zoom: 8 
    });
  }
}