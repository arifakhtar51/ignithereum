  import React, { useState, useEffect } from 'react';
  import { ethers } from 'ethers';
  import './Profile.css';

  const CONTRACT_ADDRESS = '0x12fa87235f27b670f6b57a5bcfa400f3fa6be7ae';
  const CONTRACT_ABI = [
    {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "ownerOf",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "tokensOfOwner",
      "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "tokenURI",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "getTokenMetadata",
      "outputs": [
        {
          "components": [
            { "internalType": "address", "name": "creator", "type": "address" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "string", "name": "ipfsCID", "type": "string" }
          ],
          "internalType": "struct MyCustomNFT.TokenMetadata",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const tokenIds = await contract.tokensOfOwner(account);
  
        const nftData = await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              const tokenUri = await contract.tokenURI(tokenId);
              const metadata = await contract.getTokenMetadata(tokenId);
  
              const response = await fetch(tokenUri);
              const json = await response.json();
  
              return {
                id: tokenId.toString(),
                image: json.image,
                name: json.name || 'Untitled',
                description: json.description || 'No description provided',
                creator: metadata.creator,
                timestamp: new Date(Number(metadata.timestamp) * 1000).toLocaleString(),
                ipfsCID: metadata.ipfsCID
              };
            } catch (innerError) {
              console.error(`Failed to fetch NFT ${tokenId}:`, innerError);
              return null;
            }
          })
        );
  
        setNfts(nftData.filter(nft => nft !== null));
      } catch (err) {
        console.error('Error fetching NFTs:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (!account) {
      return <div className="profile-container"><h2>Please connect your wallet to view your NFTs</h2></div>;
    }
  
    if (loading) {
      return <div className="profile-container"><h2>Loading your NFTs...</h2></div>;
    }
  
    return (
      <div className="profile-container">
        <h2>Your Minted NFTs</h2>
        {nfts.length === 0 ? (
          <p>You haven't minted any NFTs yet.</p>
        ) : (
          <div className="nft-grid">
            {nfts.map(nft => (
              <div className="nft-card" key={nft.id}>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="nft-image"
                  onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"}
                />
                <div className="nft-details">
                  <h3>{nft.name}</h3>
                  <p>{nft.description}</p>
                  <div className="nft-meta">
                    <p><strong>Minted on:</strong> {nft.timestamp}</p>
                    <p><strong>Creator:</strong> {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}</p>
                    <p><strong>IPFS CID:</strong> {nft.ipfsCID}</p>
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
  