import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {

  item: any;
  selectedImage: any = null;
  uploadPercent: number | undefined;
  uploadSubscription: Subscription | null = null;
  alertController: any;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // รับข้อมูล สินค้า ที่ส่งมาจาก DetailComponent
    const navigation = this.router.getCurrentNavigation();
    this.item = navigation?.extras?.state?.['item'];
  }


  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  async onSubmit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      let downloadURL: string | undefined = this.item.image;
      // Keep the existing image URL initially

      if (this.selectedImage) {
        // Upload the new image if selected
        const filePath = `article_images/${Date.now()}_${this.selectedImage.name}`;
        const fileRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.selectedImage);
        uploadTask.percentageChanges().subscribe(percentage => {
          this.uploadPercent = percentage;
        });

        try {
          await uploadTask;
          downloadURL = await fileRef.getDownloadURL().toPromise();
        } catch (error) {
          console.error('Error uploading image:', error);
          // Handle the error (e.g., show a message to the user)
        }
      }
	    //Code Here
      try {
        const firestoreInstance = this.firestore.firestore;
        if (!this.item || !this.item.docID) {
          console.error('Invalid product data. Cannot update.');
          return;
        }

        // สร้าง object สำหรับอัปเดตข้อมูล โดยไม่รวม field 'image' ไว้ก่อน
        const updateData: any = {
          title: this.item.title,
          detail: this.item.details,
          quantity: this.item.quantity,
          price: this.item.price,
          otherInfo: this.item.otherInfo,
          contactInfo: this.item.contactInfo
        };

        // ถ้ามีการอัปโหลดรูปภาพใหม่ ให้เพิ่ม field 'image' เข้าไปใน updateData
        if (downloadURL) {
          updateData.imageUrl = downloadURL;
        }

        //Code Here
        await updateDoc(doc(firestoreInstance, 'contents', this.item.docID), updateData);

        console.log('Product updated successfully!');

        this.selectedImage = null;
        this.uploadPercent = undefined;

        this.router.navigate(['/detail'], { state: { item: this.item } });
      } catch (error) {
        console.error("Error updating product to Firestore:", error);

        const alert = await this.alertController.create({
          header: 'Update Error',
          buttons: ['OK']
        });

        await alert.present();

      }

    }
  }



}
