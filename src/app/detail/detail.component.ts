import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

//เพิ่มที่นี่
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, of, timer } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { arrayUnion, addDoc, collection, Timestamp } from 'firebase/firestore';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  item: any;
  docID: string = '';
  

  headOfGroup$!: Observable<string | undefined>;
  comments = [
    {
      commentCollection: '',
      dateTime: '',
      itemId: ''
    }
  ];

  newComment: string = '';

  constructor(private router: Router, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    const navigation = this.router.getCurrentNavigation();
    this.item = navigation?.extras?.state?.['item'];
    
  }


  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.item = navigation?.extras?.state?.['item'];
    console.log('Item:', this.item, this.item.docID);
    

    this.firestore.collection('comments', ref => ref.where('itemId', '==', this.item.docID)).valueChanges().subscribe((commentText: any[]) => { 
      this.comments = commentText;
      });
      
  }




  async editDetail() {
    console.log('Edit trip clicked!');
    console.log('Edit trip clicked!');
    this.router.navigate(['/edit'],

      { state: { item: this.item } });
  }


  async addComment() {
    const user = await this.afAuth.currentUser;
    if (user && this.item.docID) {
      if (this.newComment != '') {
        try {
          console.log('comment add!', this.item.docID);
          await addDoc(collection(this.firestore.firestore, 'comments'), {
            commentCollection: this.newComment,
            dateTime: Timestamp.now(),
            itemId: this.item.docID
          });
        } catch (error) {
          console.error("Error adding article to Firestore:", error);
        }
        this.newComment = '';
      }
    }
  }


}
