import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';


@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit, OnDestroy {

  @Input() item: any;

  articleTitle = '';
  articleContent = '';
  selectedImage: any = null;
  uploadPercent: number | undefined;
  uploadSubscription: Subscription | null = null;

  quantity: number = 0;
  price: number = 0;
  releaseDate: string = '';
  details: string = '';
  otherInfo: string = '';
  contactInfo: string = '';

  constructor(
    private modalCtrl: ModalController,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(); // Close the modal
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  async onSubmit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const filePath = `users_images/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedImage);
      uploadTask.percentageChanges().subscribe(percentage => {
        this.uploadPercent = percentage;
      });

      let downloadURL: string | undefined;
      try {
        await uploadTask;
        downloadURL = await fileRef.getDownloadURL().toPromise();
      } catch (error) {
        console.error('Error uploading image:', error);
      }

      if (downloadURL) {
        try {
          const firestoreInstance = this.firestore.firestore;
          const tripsCollection = collection(firestoreInstance, 'contents');
         
          const docRef = await addDoc(tripsCollection, {
            title: this.articleTitle,
          });

          console.log('Document written with ID: ', docRef.id);
          const doc_id = docRef.id;
          await updateDoc(doc(firestoreInstance, 'contents', docRef.id), {
            docID: doc_id,
            content: this.articleContent,
            imageUrl: downloadURL,
            quantity: this.quantity,
            price: this.price,
            releaseDate: this.releaseDate,
            details: this.details,
            otherInfo: this.otherInfo,
            contactInfo: this.contactInfo,
            userId: user.uid, // Add user's UID
            userEmail: user.email, // Add user's email (if available)
            userDisplayName: user.displayName // Add user's display name (if available)
          });
  
          console.log('Document updated successfully!');


          this.articleTitle = '';
          this.articleContent = '';
          this.selectedImage = null;
          this.uploadPercent = undefined;
          this.quantity = 0;
          this.price = 0;
          this.releaseDate = '';
          this.details = '';
          this.otherInfo = '';
          this.contactInfo = '';

          await this.modalCtrl.dismiss();
        } catch (error) {
          console.error("Error adding article to Firestore:", error);
        }

      }

    }

  }
}
