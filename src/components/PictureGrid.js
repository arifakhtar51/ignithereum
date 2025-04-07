import React from 'react';
import PictureCard from './PictureCard';
import './PictureGrid.css';

function PictureGrid({ pictures, onAddToCart }) {
  return (
    <div className="picture-grid">
      {pictures.map(picture => (
        <PictureCard
          key={picture.id}
          picture={picture}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default PictureGrid; 