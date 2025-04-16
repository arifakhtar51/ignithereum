import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ account, onConnectWallet, cartItems }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Picture Marketplace</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/nft" className="nav-link">NFT</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/cart" className="nav-link cart-link">
          Cart {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
        </Link>
        <button onClick={onConnectWallet} className="connect-wallet-button">
          {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect MetaMask'}
        </button>
      </div>
    </nav>
  );
}

export default Navigation;