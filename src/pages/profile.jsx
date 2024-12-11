import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user info
        const user = auth.currentUser;
        if (user) {
          setUserInfo({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });

          // Fetch purchase history from Firestore
          const q = query(
            collection(db, "purchases"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const purchases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPurchaseHistory(purchases);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = async () => {
    const newName = prompt("Enter your new name:", userInfo?.name || "");
    const newPhotoURL = prompt("Enter the new photo URL:", userInfo?.photoURL || "");

    if (newName || newPhotoURL) {
      try {
        const user = auth.currentUser;
        if (user) {
          await updateProfile(user, {
            displayName: newName || user.displayName,
            photoURL: newPhotoURL || user.photoURL,
          });
          setUserInfo({
            ...userInfo,
            name: newName || userInfo.name,
            photoURL: newPhotoURL || userInfo.photoURL,
          });
          alert("Profile updated successfully!");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again later.");
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* User Information */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-lg p-6 mb-6 text-white">
        <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
        {userInfo ? (
          <div className="flex items-center gap-4">
            {userInfo.photoURL && (
              <img
                src={userInfo.photoURL}
                alt="User Avatar"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            )}
            <div>
              <p className="text-lg mb-2"><strong>Name:</strong> {userInfo.name}</p>
              <p className="text-lg"><strong>Email:</strong> {userInfo.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-lg">No user information available.</p>
        )}
      </div>

      {/* Purchase History */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Purchase History</h2>
        {purchaseHistory.length > 0 ? (
          <ul>
            {purchaseHistory.map((purchase) => (
              <li
                key={purchase.id}
                className="border-b border-gray-200 py-4 hover:bg-gray-50 transition duration-300"
              >
                <p className="text-lg font-semibold text-gray-700">Order ID: {purchase.id}</p>
                <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${purchase.total.toFixed(2)}</p>
                <p><strong>Items:</strong> {purchase.items.map(item => item.name).join(", ")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-500">No purchases found.</p>
        )}
      </div>

      {/* Additional Features */}
      <div className="bg-gray-100 shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Your Actions</h2>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={handleUpdateProfile}
          >
            Update Profile
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
