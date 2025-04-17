import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';
import Profile from './components/Profile';
import NFT from './components/NFT';
import PictureGrid from './components/PictureGrid';
import CartPage from './components/CartPage';
import Navigation from './components/Navigation';

// Your testnet wallet address where payments will be sent
const SELLER_WALLET_ADDRESS = '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E';

function App() {
  const [cart, setCart] = useState([]);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [pictures, setPictures] = useState([
    {
      id: 1,
      title: 'Mountain View',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: 2,
      title: 'Ocean Sunset',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=2',
    },
    {
      id: 3,
      title: 'City Skyline',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=3',
    },
    {
      id: 4,
      title: 'Forest Path',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=4',
    },
    {
      id: 5,
      title: 'Desert Dunes',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=5',
    },
    {
      id: 6,
      title: 'Beach Paradise',
      price: 0.0000001,
      imageUrl: 'https://picsum.photos/300/200?random=6',
    },
  ]);

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
      const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
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

  return (
    <Router>
      <div className="App">
        <Navigation 
          account={account} 
          onConnectWallet={connectWallet} 
          cartItems={cart.length} 
        />
        <Routes>
          <Route 
            path="/" 
            element={
              <main className="App-main">
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
          <Route 
            path="/profile" 
            element={<Profile account={account} />} 
          />
          <Route 
            path="/nft" 
            element={<NFT account={account} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
