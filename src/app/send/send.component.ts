import { Component, OnDestroy, Input } from '@angular/core';
// AngularFireStorage ไม่ได้ใช้แล้ว จึงลบออกไป
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { ModalController, IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// Firestore modular imports ยังคงใช้อยู่
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  imports: [IonicModule,FormsModule]
})
export class SendComponent implements OnDestroy {

  @Input() item: any;

  // --- Form data properties ---
  articleTitle = '';
  articleContent = '';
  selectedImage: File | null = null; // เปลี่ยน type เป็น File | null เพื่อความชัดเจน
  uploadPercent: number | undefined;
  // uploadSubscription ไม่จำเป็นต้องใช้แล้ว
  
  quantity: number | null = null;
  price: number | null = null;
  releaseDate: string = '';
  details: string = '';
  otherInfo: string = '';
  contactInfo: string = '';

  constructor(
    private modalCtrl: ModalController,
    // ไม่ต้อง inject AngularFireStorage แล้ว
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  // ngOnInit ว่างไว้เหมือนเดิม
  ngOnInit() { }

  // ngOnDestroy ไม่จำเป็นต้องใช้แล้วถ้าไม่มี subscription อื่นๆ
  ngOnDestroy() { }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
      this.uploadPercent = 0; // Reset progress bar เมื่อเลือกไฟล์ใหม่
    }
  }

  /**
   * [ใหม่] เมธอดสำหรับอัปโหลดไฟล์ไปยัง Cloudinary พร้อมติดตามความคืบหน้า
   */
  private uploadToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // !! ต้องเปลี่ยน: YOUR_CLOUD_NAME และ YOUR_UPLOAD_PRESET
      const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dp9xmkdvd/image/upload';
      const uploadPreset = 'filefrommyapp';

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', cloudinaryUrl, true);

      // Listener สำหรับติดตามความคืบหน้าการอัปโหลด
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          this.uploadPercent = Math.round((event.loaded / event.total) * 100);
        }
      };

      // เมื่ออัปโหลดเสร็จสิ้น
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url); // คืนค่า URL ของรูปภาพ
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };
      
      // เมื่อเกิดข้อผิดพลาด
      xhr.onerror = () => {
        reject(new Error('Network error during upload.'));
      };

      xhr.send(formData);
    });
  }

  /**
   * [ปรับปรุง] เมธอดหลักสำหรับ Submit ข้อมูล
   */
  async onSubmit() {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("User not logged in!");
      return;
    }
    if (!this.selectedImage) {
      console.error("No image selected!");
      return;
    }

    try {
      // 1. อัปโหลดรูปไป Cloudinary และรอรับ URL กลับมา
      const imageUrl = await this.uploadToCloudinary(this.selectedImage as File);

      // 2. เมื่อได้ URL แล้ว ให้บันทึกข้อมูลทั้งหมดลง Firestore
      const firestoreInstance: Firestore = getFirestore(getApp());
      const contentsCollection = collection(firestoreInstance, 'contents');
      
      // สร้างเอกสารใหม่พร้อมข้อมูลทั้งหมดในครั้งเดียว
      const docRef = await addDoc(contentsCollection, {
        title: this.articleTitle,
        content: this.articleContent,
        imageUrl: imageUrl, // <-- ใช้ URL จาก Cloudinary
        quantity: this.quantity,
        price: this.price,
        releaseDate: this.releaseDate,
        details: this.details,
        otherInfo: this.otherInfo,
        contactInfo: this.contactInfo,
        userId: user.uid,
        userEmail: user.email,
        userDisplayName: user.displayName,
        createdAt: new Date() // เพิ่ม timestamp ตอนสร้าง
      });

      console.log('Document written with ID: ', docRef.id);

      // อัปเดตเอกสารเดิมโดยเพิ่ม docID ของตัวเองเข้าไป
      await updateDoc(doc(firestoreInstance, 'contents', docRef.id), {
        docID: docRef.id
      });

      console.log('Document updated with its own ID!');

      console.log('Document updated with its own ID!');

      // 3. Reset ฟอร์มและปิด Modal
      this.resetFormAndCloseModal();

    } catch (error) {
      console.error("Error during submission process:", error);
      this.uploadPercent = undefined; // ซ่อน progress bar ถ้าเกิดข้อผิดพลาด
    }
  }

  private async resetFormAndCloseModal() {
    this.articleTitle = '';
    this.articleContent = '';
    this.selectedImage = null;
    this.uploadPercent = undefined;
    this.quantity = null;
    this.price = null;
    this.releaseDate = '';
    this.details = '';
    this.otherInfo = '';
    this.contactInfo = '';
    await this.modalCtrl.dismiss({ submitted: true });
  }
}
