import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { FirebaseApp, initializeApp } from 'firebase/app';

class Firebase {
  public readonly app: FirebaseApp;

  public readonly storage: FirebaseStorage;

  constructor() {
    this.app =
      global.firebase ??
      initializeApp({
        projectId: 'experiment',
        storageBucket: 'experiment.appspot.com',
      });

    if (process.env.NODE_ENV === 'development') {
      global.firebase = this.app;
    }

    this.storage = getStorage(this.app);

    connectStorageEmulator(this.storage, 'localhost', 9199);
  }

  /**
   * Upload blob to firebase storage at specified path
   * @returns The url
   */
  async uploadFile(path: string, file: File | Blob | Uint8Array | ArrayBuffer) {
    const ref = storageRef(this.storage, path);

    await uploadBytes(ref, file);

    return this.getFileUrl(path);
  }

  /**
   * Get uploaded file url from storaged by path
   * @returns The url
   */
  getFileUrl(path: string) {
    const ref = storageRef(this.storage, path);

    return getDownloadURL(ref);
  }
}

const firebase = new Firebase();

export default firebase;
