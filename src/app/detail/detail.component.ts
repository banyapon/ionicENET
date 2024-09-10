import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  item: any;

  constructor(private router: Router, private modalCtrl: ModalController) {

  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.item = navigation?.extras?.state?.['item'];
    console.log('Item:', this.item);
  }


  async editDetail() {
    console.log('Edit trip clicked!');
    console.log('Edit trip clicked!');
    this.router.navigate(['/edit'],
     
    { state: { item: this.item } });
  }

}
