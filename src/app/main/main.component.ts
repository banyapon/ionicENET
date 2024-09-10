import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { SendComponent } from '../send/send.component';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: any = null;
  private authSub: Subscription | undefined;
  items = [
    {
      title: '',
      price: '',
      imageUrl: '',
      id: 1
    }
  ];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  goToDetails(item: any) {
    console.log('Item to be sent:', item); // ตรวจสอบข้อมูล item ก่อนนำทาง
    this.router.navigate(['/detail'], { state: { item } });
  }

  ngOnInit() {
    // Subscribe to changes in authentication state
    this.authSub = this.afAuth.authState.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/home']); // Redirect to login page
      } else {
        // Fetch articles from Firestore when user is logged in
        this.firestore.collection('contents').valueChanges().subscribe((articles: any[]) => {
          this.items = articles; // Update the items array with articles from Firestore
        });
      }
    });
  }


  async openSendComponent() {
    const modal = await this.modalCtrl.create({ component: SendComponent, });
    return await modal.present();
  }

}