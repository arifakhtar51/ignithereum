import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import PictureGrid from './components/PictureGrid';
import ShoppingCart from './components/ShoppingCart';

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
      price: 0.000001, // Price in ETH
      imageUrl: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: 2,
      title: 'Ocean Sunset',
      price: 0.000001,
      imageUrl: 'https://picsum.photos/300/200?random=2',
    },
    {
      id: 3,
      title: 'City Skyline',
      price: 0.000001,
      imageUrl: 'https://picsum.photos/300/200?random=3',
    },
    {
      id: 4,
      title: 'Forest Path',
      price: 0.000001,
      imageUrl: 'https://picsum.photos/300/200?random=4',
    },
    {
      id: 5,
      title: 'Desert Dunes',
      price: 0.000001,
      imageUrl: 'https://picsum.photos/300/200?random=5',
    },
    {
      id: 6,
      title: 'Beach Paradise',
      price: 0.000001,
      imageUrl: 'https://picsum.photos/300/200?random=6',
    },
  ]);

  const connectWallet = async () => {
    try {
      // Check if window.ethereum exists and is MetaMask
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      // Check if we're authorized to access the user's accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        alert('Please connect your MetaMask account!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      setAccount(accounts[0]);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          setAccount('');
          setProvider(null);
        } else {
          setAccount(newAccounts[0]);
        }
      });

      // Listen for chain changes
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

      // Get the signer
      const signer = await provider.getSigner();

      // Send the transaction
      const tx = await signer.sendTransaction({
        to: SELLER_WALLET_ADDRESS,
        value: totalPriceInWei,
      });

      // Wait for the transaction to be mined
      await tx.wait();

      // Remove purchased pictures from the marketplace
      const purchasedIds = cart.map(item => item.id);
      setPictures(pictures.filter(picture => !purchasedIds.includes(picture.id)));
      
      // Clear the cart
      setCart([]);
      
      alert('Payment successful! Transaction hash: ' + tx.hash);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Picture Marketplace</h1>
        {!account ? (
          <button onClick={connectWallet} className="connect-wallet-button">
            Connect MetaMask
          </button>
        ) : (
          <p className="wallet-address">Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
        )}
      </header>
      <main className="App-main">
        <PictureGrid pictures={pictures} onAddToCart={addToCart} />
        <ShoppingCart 
          cart={cart} 
          onRemoveFromCart={removeFromCart} 
          onPayment={handlePayment} 
        />
      </main>
    </div>
  );
}

export default App; 