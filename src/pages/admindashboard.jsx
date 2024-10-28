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

const categories = ['Gadgets', 'Accessories', 'Software', 'Services', 'phones', 'wearables'];

function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0); // 0: Products, 1: Purchases
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);

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

  // Fetch purchases from Firestore
  useEffect(() => {
    const fetchPurchases = async () => {
      const purchasesCollection = collection(db, 'purchases');
      const purchasesSnapshot = await getDocs(purchasesCollection);
      const fetchedPurchases = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(fetchedPurchases);
    };
    fetchPurchases();
  }, []);

  // Check if user is admin
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAdmin === false) {
    return <Navigate to="/" />;
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNewProduct({ name: product.name, price: product.price, description: product.description, category: product.category });
  };

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
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Typography variant="h4" className="mb-6 text-center font-bold text-blue-600">Admin Dashboard</Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Products" />
        <Tab label="Purchases" />
      </Tabs>

      {tabIndex === 0 && (
        <div>
          <Typography variant="h6" className="mt-4 text-center">{editingProductId ? 'Edit Product' : 'Add New Product'}</Typography>
          
          <div className="bg-white p-4 rounded shadow-md ">
            <div className="flex flex-wrap gap-3">
              <TextField
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mr-4 mb-4"
              />
              <TextField
                label="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="mr-4 mb-4"
              />
              <TextField
                label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="mr-4 mb-4"
              />
              <Select
                label="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="mr-4 mb-4"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              <span component="label" className="mr-4 mb-4 bg-blue-600 text-white p-2 rounded cursor-pointer align-center" >
                Upload Image
                <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} />
              </span>
              <span component="label" className="mr-4 mb-4 bg-blue-600 text-white p-2 rounded cursor-pointer align-center" 
                variant="contained"
                color="primary"
                onClick={editingProductId ? () => handleSaveProduct(editingProductId) : handleAddProduct}
              >
                {editingProductId ? 'Save Changes' : 'Add Product'}
              </span>
            </div>
          </div>

          {/* Product List */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Image</TableCell> {/* Added Image Column */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <img src={product.imageUrl} alt={product.name} style={{ width: 50, height: 50 }} /> {/* Display Image */}
                    </TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleEditProduct(product)}>Edit</Button>
                      <Button color="secondary" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {tabIndex === 1 && (
        <div>
          <Typography variant="h6" className="mt-4 text-center">Purchase History</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.productName}</TableCell>
                    <TableCell>{purchase.price}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.buyer}</TableCell>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
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
