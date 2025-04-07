import React, { useState } from 'react';
import './App.css';
import PictureGrid from './components/PictureGrid';
import ShoppingCart from './components/ShoppingCart';

function App() {
  const [cart, setCart] = useState([]);
  const [pictures, setPictures] = useState([
    {
      id: 1,
      title: 'Mountain View',
      price: 29.99,
      imageUrl: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: 2,
      title: 'Ocean Sunset',
      price: 39.99,
      imageUrl: 'https://picsum.photos/300/200?random=2',
    },
    {
      id: 3,
      title: 'City Skyline',
      price: 49.99,
      imageUrl: 'https://picsum.photos/300/200?random=3',
    },
    {
      id: 4,
      title: 'Forest Path',
      price: 24.99,
      imageUrl: 'https://picsum.photos/300/200?random=4',
    },
    {
      id: 5,
      title: 'Desert Dunes',
      price: 34.99,
      imageUrl: 'https://picsum.photos/300/200?random=5',
    },
    {
      id: 6,
      title: 'Beach Paradise',
      price: 44.99,
      imageUrl: 'https://picsum.photos/300/200?random=6',
    },
  ]);

  const addToCart = (picture) => {
    setCart([...cart, picture]);
  };

  const removeFromCart = (pictureId) => {
    setCart(cart.filter(item => item.id !== pictureId));
  };

  const handlePayment = () => {
    // Remove purchased pictures from the marketplace
    const purchasedIds = cart.map(item => item.id);
    setPictures(pictures.filter(picture => !purchasedIds.includes(picture.id)));
    // Clear the cart
    setCart([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Picture Marketplace</h1>
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