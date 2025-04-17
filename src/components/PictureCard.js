import React from 'react';
import './PictureCard.css';

function PictureCard({ picture, onAddToCart }) {
  return (
    <div className="picture-card">
      <img src={picture.imageUrl} alt={picture.title} className="picture-image" />
      <div className="picture-details">
        <h3>{picture.title}</h3>
        <p className="price">{picture.price.toFixed(7)} ETH</p>
        <button 
          className="buy-button"
          onClick={() => onAddToCart(picture)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default PictureCard; 