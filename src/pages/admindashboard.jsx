import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Select } from '@mui/material';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { Navigate } from 'react-router-dom';

const categories = ['Gadgets', 'Accessories', 'Software', 'Services']; // Available categories

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null); // ID of the product being edited

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { role } = userDoc.data();
          setIsAdmin(role === 'admin');
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not admin
  if (isAdmin === false) {
    return <Navigate to="/" />;
  }

  // Handle adding a new product with image upload
  const handleAddProduct = async () => {
    const { name, price, description, category } = newProduct;

    if (name && price && imageFile && category) {
      const storageRef = ref(storage, `productImages/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);
      const productData = { name, price, description, imageUrl, category };

      const addedProductDoc = await addDoc(collection(db, 'products'), productData);
      setProducts([...products, { id: addedProductDoc.id, ...productData }]); // Add new product with ID to the state
      setNewProduct({ name: '', price: '', description: '', category: '' });
      setImageFile(null);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(product => product.id !== id));
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNewProduct({ name: product.name, price: product.price, description: product.description, category: product.category });
  };

  // Handle saving changes to a product
  const handleSaveProduct = async (id) => {
    const { name, price, description, category } = newProduct;
    const updatedData = { name, price, description, category };

    const productDocRef = doc(db, 'products', id);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      if (imageFile) {
        const storageRef = ref(storage, `productImages/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        updatedData.imageUrl = imageUrl;
      }

      await updateDoc(productDocRef, updatedData);
      setProducts(products.map(product => product.id === id ? { ...product, ...updatedData } : product));
      setEditingProductId(null);
      setNewProduct({ name: '', price: '', description: '', category: '' });
      setImageFile(null);
    } else {
      console.error('No product found to update');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Typography variant="h4" className="mb-6 text-center font-bold text-blue-600">Admin Dashboard</Typography>

      <div className="bg-white p-4 rounded shadow-md mb-6">
        <Typography variant="h6" className="mb-4">{editingProductId ? 'Edit Product' : 'Add New Product'}</Typography>
        
        <div className="flex flex-wrap mb-4">
          <TextField
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mr-2 mb-2"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="mr-2 mb-2"
            variant="outlined"
            fullWidth
          />
        </div>

        <TextField
          label="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="mb-2"
          variant="outlined"
          fullWidth
        />

        <Select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          displayEmpty
          className="mb-2"
          variant="outlined"
          fullWidth
        >
          <MenuItem value="" disabled>Select Category</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="mb-2"
        />

        {editingProductId ? (
          <Button variant="contained" color="primary" onClick={() => handleSaveProduct(editingProductId)}>Save Product</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
        )}
      </div>

      <Typography variant="h6" className="mt-4 text-center">Product List</Typography>
      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '50px', borderRadius: '4px' }} />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                  <Button variant="outlined" color="primary" onClick={() => handleEditProduct(product)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AdminDashboard;
