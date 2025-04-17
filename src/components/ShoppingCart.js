// const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5OTMyNjE0OC1hMzIzLTQ0YzItYjUwNi00MTU0YTNiMTNmMzMiLCJlbWFpbCI6ImFyaWZha2h0YXI5MDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQzNTk1MDk4NTdkOWQ5MzQ5NzRhIiwic2NvcGVkS2V5U2VjcmV0IjoiOGYxNDk0MzcxMDkwZDlkNGVlNmMwZmQ3ODc3YzFiZjAxZTQ4ZDI2NTgwNWNmYmRkNzRhODM3YmVkMzc1YzFjOCIsImV4cCI6MTc3NjQwNDM4MH0.nxRwbJC5w5dakMsKraeb0dHrXzroNqLXkpazaSlE86Y'; // Ensure it's your valid JWT// Ensure it's your valid JWT
   




import React, { useState } from 'react';
import { ethers } from 'ethers';
import './ShoppingCart.css';

const contractAddress = '0x12fa87235f27b670f6b57a5bcfa400f3fa6be7ae';
const contractABI = [
  'function mint(string memory uri, string memory ipfsCID) external',
];

function ShoppingCart({ cart, onRemoveFromCart }) {
  const [status, setStatus] = useState('');
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    }
    return null;
  };

  const handleMint = async () => {
    const walletAddress = await checkWalletConnection();
    if (!walletAddress) {
      alert('⚠️ Please connect your wallet first.');
      return;
    }

    // Step 1: Upload JSON to IPFS via Pinata
    const formData = new FormData();
    const cartMetadata = {
      name: "Cart NFT",
      description: "Shopping cart NFT",
      cart,
      wallet: walletAddress,
      timestamp: new Date().toISOString(),
    };

    const jsonBlob = new Blob([JSON.stringify(cartMetadata)], { type: 'application/json' });
    formData.append('file', jsonBlob, 'cart.json');

    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5OTMyNjE0OC1hMzIzLTQ0YzItYjUwNi00MTU0YTNiMTNmMzMiLCJlbWFpbCI6ImFyaWZha2h0YXI5MDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQzNTk1MDk4NTdkOWQ5MzQ5NzRhIiwic2NvcGVkS2V5U2VjcmV0IjoiOGYxNDk0MzcxMDkwZDlkNGVlNmMwZmQ3ODc3YzFiZjAxZTQ4ZDI2NTgwNWNmYmRkNzRhODM3YmVkMzc1YzFjOCIsImV4cCI6MTc3NjQwNDM4MH0.nxRwbJC5w5dakMsKraeb0dHrXzroNqLXkpazaSlE86Y'; // Ensure it's your valid JWT// Ensure it's your valid JWT
   
    try {
      setStatus('⏳ Uploading to IPFS...');
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.details || 'Upload failed');
      }

      const ipfsCID = data.IpfsHash;
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${ipfsCID}`;

      setStatus('✅ Uploaded to IPFS. Minting NFT...');

      // Step 2: Mint NFT
      if (!window.ethereum) return alert('MetaMask is required!');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.mint(tokenURI, ipfsCID);
      setStatus('🛠 Minting... Please wait for confirmation.');
      await tx.wait();

      setStatus('✅ NFT Minted Successfully!');
      alert('NFT Minted! 🎉');
    } catch (err) {
      console.error('❌ Error:', err);
      setStatus('❌ Error occurred. See console for details.');
    }
  };

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
                  <p>{item.price.toFixed(7)} ETH</p>
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
            <h3>Total: {totalPrice.toFixed(7)} ETH</h3>
            <button className="pay-button" onClick={handleMint}>
              Mint Now
            </button>
            {status && <p style={{ marginTop: '10px' }}>{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;
