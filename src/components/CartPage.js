import React from 'react';
import ShoppingCart from './ShoppingCart';
import './CartPage.css';

function CartPage({ cart, onRemoveFromCart, onPayment }) {
  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      <ShoppingCart 
        cart={cart} 
        onRemoveFromCart={onRemoveFromCart} 
        onPayment={onPayment} 
      />
    </div>
  );
}

export default CartPage; 