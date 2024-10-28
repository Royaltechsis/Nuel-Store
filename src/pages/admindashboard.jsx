// pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  Tabs,
  Tab
} from '@mui/material';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Navigate } from 'react-router-dom';

const categories = ['Gadgets', 'Accessories', 'Software', 'Services', 'Phones', 'Wearables'];

function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const fetchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  // Fetch Purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      const purchasesCollection = collection(db, 'purchases');
      const purchasesSnapshot = await getDocs(purchasesCollection);
      const fetchedPurchases = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(fetchedPurchases);
    };
    fetchPurchases();
  }, []);

  // Check Admin Role
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

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleAddProduct = async () => {
    const { name, price, description, category } = newProduct;
    if (name && price && imageFile && category) {
      const storageRef = ref(storage, `productImages/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);
      const productData = { name, price, description, imageUrl, category };
      const addedProductDoc = await addDoc(collection(db, 'products'), productData);
      setProducts([...products, { id: addedProductDoc.id, ...productData }]);
      setNewProduct({ name: '', price: '', description: '', category: '' });
      setImageFile(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    setProducts(products.filter(product => product.id !== id));
  };

  const handleEditProduct = async () => {
    const { name, price, description, category } = newProduct;
    const updatedData = { name, price, description, category };
    if (imageFile) {
      const storageRef = ref(storage, `productImages/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);
      updatedData.imageUrl = imageUrl;
    }
    await updateDoc(doc(db, 'products', editingProductId), updatedData);
    setProducts(products.map(product => (product.id === editingProductId ? { ...product, ...updatedData } : product)));
    setNewProduct({ name: '', price: '', description: '', category: '' });
    setImageFile(null);
    setEditingProductId(null);
  };

  return (
    <div className="container m-20 mx-auto card p-6">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Products" />
        <Tab label="Purchases" />
      </Tabs>

      {tabIndex === 0 ? (
        <div>
          <Typography variant="h6">Product List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${parseFloat(product.price || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <img src={product.imageUrl} alt={product.name} width={50} height={50} onError={(e) => { e.target.src = '/placeholder.png'; }} />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => {
                        setEditingProductId(product.id);
                        setNewProduct({
                          name: product.name,
                          price: product.price,
                          description: product.description,
                          category: product.category
                        });
                      }}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Add or Edit Product */}
          <div className="mt-4 space-y-4">
            <TextField label="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} fullWidth />
            <TextField label="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} fullWidth />
            <TextField label="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} fullWidth />
            <Select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} fullWidth>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} />

            {editingProductId ? (
              <Button variant="contained" color="primary" onClick={handleEditProduct}>
                Update Product
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleAddProduct}>
                Add Product
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="h6">Purchase History</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Purchased By</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map(purchase => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.name}</TableCell>
                    <TableCell>{purchase.id}</TableCell>
                    <TableCell>{purchase.purchasedby}</TableCell>
                    <TableCell>${parseFloat(purchase.price || 0).toFixed(2)}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>${parseFloat(purchase.total || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
