import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';
import Profile from './components/Profile';
import NFT from './components/NFT';
import PictureGrid from './components/PictureGrid';
import CartPage from './components/CartPage';
import Navigation from './components/Navigation';

const SELLER_WALLET_ADDRESS = '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E';

function App() {
  const [cart, setCart] = useState([]);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    previewUrl: '',
  });

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        alert('Please connect your MetaMask account!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setAccount(accounts[0]);

      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          setAccount('');
          setProvider(null);
        } else {
          setAccount(newAccounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        alert('Please connect to MetaMask to continue.');
      } else {
        alert('An error occurred while connecting to MetaMask. Please try again.');
      }
    }
  };

  const addToCart = (picture) => {
    setCart([...cart, picture]);
  };

  const removeFromCart = (pictureId) => {
    setCart(cart.filter(item => item.id !== pictureId));
  };

  const handlePayment = async () => {
    if (!provider || !account) {
      alert('Please connect your MetaMask wallet first!');
      return;
    }

    try {
      const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
      const totalPriceInWei = ethers.parseEther(totalPrice.toString());

      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: SELLER_WALLET_ADDRESS,
        value: totalPriceInWei,
      });

      await tx.wait();

      const purchasedIds = cart.map(item => item.id);
      setPictures(pictures.filter(picture => !purchasedIds.includes(picture.id)));
      setCart([]);

      alert('Payment successful! Transaction hash: ' + tx.hash);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = file ? URL.createObjectURL(file) : '';
    setForm(prev => ({ ...prev, image: file, previewUrl: url }));
  };

  const handleAddPicture = () => {
    if (!form.title || !form.price || !form.previewUrl) {
      alert('Please complete the form.');
      return;
    }

    const newPicture = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      imageUrl: form.previewUrl,
    };

    setPictures([...pictures, newPicture]);
    setForm({ title: '', description: '', price: '', image: null, previewUrl: '' });
  };

  return (
    <Router>
      <div className="App">
        <Navigation account={account} onConnectWallet={connectWallet} cartItems={cart.length} />
        <Routes>
          <Route
            path="/"
            element={
              <main className="App-main">
                <div className="upload-form">
                  <h2>Add a New Picture To Be Mint</h2>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price in ETH"
                    value={form.price}
                    onChange={handleInputChange}
                    step="0.0001"
                  />
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  {form.previewUrl && <img src={form.previewUrl} alt="Preview" width="200" />}
                  <button onClick={handleAddPicture}>Add</button>
                </div>

                <PictureGrid pictures={pictures} onAddToCart={addToCart} />
              </main>
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onRemoveFromCart={removeFromCart}
                onPayment={handlePayment}
              />
            }
          />
          <Route path="/profile" element={<Profile account={account} />} />
          <Route path="/nft" element={<NFT account={account} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
