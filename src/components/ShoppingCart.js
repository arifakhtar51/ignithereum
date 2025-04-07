import React from 'react';
import './ShoppingCart.css';

function ShoppingCart({ cart, onRemoveFromCart, onPayment }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <button 
                    className="remove-button"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button 
              className="pay-button"
              onClick={onPayment}
            >
              Pay Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart; 