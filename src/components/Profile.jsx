import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Profile.css';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = [/* Your contract ABI */];

function Profile({ account }) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchUserNFTs();
    }
  }, [account]);

  const fetchUserNFTs = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Get all token IDs owned by the user
      const tokenIds = await contract.tokensOfOwner(account);
      
      // Fetch metadata for each NFT
      const nftData = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const metadata = await contract.getTokenMetadata(tokenId);
          const uri = await contract.tokenURI(tokenId);
          
          // Fetch the actual metadata from IPFS
          const response = await fetch(`https://ipfs.io/ipfs/${metadata.ipfsCID}`);
          const nftMetadata = await response.json();
          
          return {
            id: tokenId.toString(),
            image: nftMetadata.image,
            name: nftMetadata.name,
            description: nftMetadata.description,
            timestamp: new Date(metadata.timestamp * 1000).toLocaleDateString(),
            creator: metadata.creator
          };
        })
      );
      
      setNfts(nftData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="profile-container">
        <h2>Please connect your wallet to view your NFTs</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading your NFTs...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Your NFTs</h2>
      {nfts.length === 0 ? (
        <p>You don't have any NFTs yet.</p>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.image} alt={nft.name} className="nft-image" />
              <div className="nft-details">
                <h3>{nft.name}</h3>
                <p>{nft.description}</p>
                <div className="nft-meta">
                  <p>Minted: {nft.timestamp}</p>
                  <p>Creator: {nft.creator.substring(0, 6)}...{nft.creator.substring(nft.creator.length - 4)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile; 