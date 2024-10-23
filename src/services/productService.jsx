// src/services/productService.js
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Function to upload product with image
export const uploadProduct = async (product, imageFile) => {
  try {
    // Create a reference to the storage bucket location
    const storageRef = ref(storage, `products/${imageFile.name}`);

    // Upload the image
    const snapshot = await uploadBytes(storageRef, imageFile);

    // Get the URL of the uploaded image
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Add product details along with the image URL to Firestore
    await addDoc(collection(db, 'products'), {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl,  // Store the image URL
    });

    return 'Product uploaded successfully';
  } catch (error) {
    console.error("Error uploading product: ", error);
    return 'Error uploading product';
  }
};
