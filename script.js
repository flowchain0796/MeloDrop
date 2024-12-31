 // Navigation
 function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = sectionId === 'explore' ? 'grid' : 'block';
}

// Wallet Connection
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const button = document.querySelector('.connect-wallet');
            button.textContent = accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
            button.style.background = 'var(--gradient-card)';
            button.style.border = '1px solid var(--secondary)';
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    } else {
        alert('Please install MetaMask to use this feature!');
    }
}

// Recommendation Form
function addSongInput() {
    const songList = document.querySelector('.song-list');
    const songCount = songList.children.length + 1;
    
    const songGroup = document.createElement('div');
    songGroup.className = 'form-group';
    songGroup.innerHTML = `
        <label>Song ${songCount}</label>
        <input type="text" placeholder="Song name" required>
        <input type="url" placeholder="Song link" required>
    `;
    songList.appendChild(songGroup);
}

function submitRecommendation(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Here you would typically send the data to your backend
    showNotification('Recommendation submitted successfully!');
    event.target.reset();
    withdraw()
    showSection('explore');
}

// Explore Page
function generateRecommendationCards() {
    const explore = document.getElementById('explore');
    const sampleData = [
        {
            genre: 'Pop',
            title: 'Summer Vibes 2024',
            curator: 'MusicLover123',
            songCount: 5
        },
        {
            genre: 'Rock',
            title: 'Classic Rock Essentials',
            curator: 'RockFan456',
            songCount: 8
        },
        {
            genre: 'Hip Hop',
            title: 'Underground Beats',
            curator: 'BeatMaster789',
            songCount: 6
        },
        {
            genre: 'Electronic',
            title: 'Late Night EDM',
            curator: 'RaveMaster',
            songCount: 7
        },
        {
            genre: 'Classical',
            title: 'Peaceful Piano',
            curator: 'ClassicalSoul',
            songCount: 4
        },
        {
            genre: 'Electronic',
            title: 'Late Night EDM',
            curator: 'RaveMaster',
            songCount: 7
        },
        {
            genre: 'Bollywood',
            title: 'Sangeet vibes',
            curator: 'RaveMaster',
            songCount: 5
        },
        {
            genre: 'Kpop',
            title: 'Late Night EDM',
            curator: 'RaveMaster',
            songCount: 2
        }
    ];
    
    explore.innerHTML = '';
    sampleData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <span class="genre-tag">${data.genre}</span>
            <h3>${data.title}</h3>
            <p>Curated by ${data.curator}</p>
            <p>${data.songCount} songs</p>
        `;
        card.onclick = () => showModal(data);
        explore.appendChild(card);
    });
}

// Modal
function showModal(data) {
    const modal = document.getElementById('recommendationModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    title.textContent = data.title;
    document.getElementById('recommenderName').textContent = data.curator;
    document.getElementById('recommenderWallet').textContent = '0x1234...5678';
    
    // Sample songs for the modal
    const sampleSongs = [
        { title: 'Amazing Song 1', artist: 'Artist A', link: 'https://www.youtube.com/watch?v=syFZfO_wfMQ' },
        { title: 'Incredible Track 2', artist: 'Artist B', link: '#' },
        { title: 'Awesome Tune 3', artist: 'Artist C', link: '#' }
    ];
    
    content.innerHTML = sampleSongs.map(song => `
        <div class="song-item">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <a href="${song.link}" target="_blank" class="hero-btn secondary-btn">Listen</a>
        </div>
    `).join('');
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('recommendationModal').style.display = 'none';
}

async function sendReward() {
    if (typeof window.ethereum !== 'undefined') {
        if (!window.ethereum.selectedAddress) {
            alert('Please connect your wallet first!');
            return;
        }
        try {
            // Here you would implement the actual token transfer
            showNotification('Reward sent successfully!');
            deposit("5")
            closeModal();
        } catch (error) {
            console.error('Error sending reward:', error);
            showNotification('Error sending reward. Please try again.', 'error');
        }
    } else {
        alert('Please install MetaMask to send rewards!');
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: var(--gradient-primary);
        color: white;
        border-radius: 10px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
window.onload = () => {
    generateRecommendationCards();
    
    // Handle navigation
    const hash = window.location.hash.slice(1) || 'home';
    showSection(hash);

    // Add hash change listener
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1) || 'home';
        showSection(newHash);
    });
};

// Close modal on outside click
window.onclick = (event) => {
    const modal = document.getElementById('recommendationModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

//profile
function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Add hover effects to recommendation cards
document.querySelectorAll('.recommendation-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.3)';
    });

    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
    });
});

const deposit = async (amount)=> {

    const abi = Token.abi;
    const charge = amount;
    console.log(charge,"=========deposit=========");
    const contractAddress = "0x28940aC88A575C2263503A4a00430B3C84d73ccf"
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const bounceContract = new ethers.Contract(contractAddress, abi, signer)

    await (await bounceContract.transfer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", ethers.utils.parseUnits(charge.toString(), 18))).wait();
  
  }
const withdraw = async (amount="10")=> {

    const abi = Token.abi;
    const charge = amount;
    console.log(charge,"=========deposit=========");
    const contractAddress = "0x28940aC88A575C2263503A4a00430B3C84d73ccf"
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const bounceContract = new ethers.Contract(contractAddress, abi, signer)

    await (await bounceContract.mint(address, ethers.utils.parseUnits(charge.toString(), 18))).wait();
  
  }

  const Token = {
    "_format": "hh-sol-artifact-1",
    "contractName": "Melo",
    "sourceName": "contracts/Melo.sol",
    "abi": [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "donate",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "bytecode": "0x608060405234801561001057600080fd5b506040805180820182526004808252634d454c4f60e01b602080840182905284518086019095529184529083015290600361004b8382610101565b5060046100588282610101565b5050506101c0565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061008a57607f821691505b6020821081036100aa57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156100fc576000816000526020600020601f850160051c810160208610156100d95750805b601f850160051c820191505b818110156100f8578281556001016100e5565b5050505b505050565b81516001600160401b0381111561011a5761011a610060565b61012e816101288454610076565b846100b0565b602080601f831160018114610163576000841561014b5750858301515b600019600386901b1c1916600185901b1785556100f8565b600085815260208120601f198616915b8281101561019257888601518255948401946001909101908401610173565b50858210156101b05787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610836806101cf6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063386bc05a11610071578063386bc05a1461012357806340c10f191461013657806370a082311461014b57806395d89b4114610174578063a9059cbb1461017c578063dd62ed3e1461018f57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101c8565b6040516100c3919061067f565b60405180910390f35b6100df6100da3660046106ea565b61025a565b60405190151581526020016100c3565b6002545b6040519081526020016100c3565b6100df61010f366004610714565b610274565b604051601281526020016100c3565b6100df610131366004610714565b610298565b6101496101443660046106ea565b610328565b005b6100f3610159366004610750565b6001600160a01b031660009081526020819052604090205490565b6100b6610336565b6100df61018a3660046106ea565b610345565b6100f361019d366004610772565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101d7906107a5565b80601f0160208091040260200160405190810160405280929190818152602001828054610203906107a5565b80156102505780601f1061022557610100808354040283529160200191610250565b820191906000526020600020905b81548152906001019060200180831161023357829003601f168201915b5050505050905090565b60003361026881858561035b565b60019150505b92915050565b60003361028285828561036d565b61028d8585856103eb565b506001949350505050565b6001600160a01b0383166000908152602081905260408120548211156103135760405162461bcd60e51b815260206004820152602560248201527f496e73756666696369656e7420616d6f756e7420696e20646f6e6f7227732077604482015264185b1b195d60da1b60648201526084015b60405180910390fd5b61031e8484846103eb565b5060019392505050565b610332828261044a565b5050565b6060600480546101d7906107a5565b60006103523384846103eb565b50600192915050565b6103688383836001610480565b505050565b6001600160a01b0383811660009081526001602090815260408083209386168352929052205460001981146103e557818110156103d657604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161030a565b6103e584848484036000610480565b50505050565b6001600160a01b03831661041557604051634b637e8f60e11b81526000600482015260240161030a565b6001600160a01b03821661043f5760405163ec442f0560e01b81526000600482015260240161030a565b610368838383610555565b6001600160a01b0382166104745760405163ec442f0560e01b81526000600482015260240161030a565b61033260008383610555565b6001600160a01b0384166104aa5760405163e602df0560e01b81526000600482015260240161030a565b6001600160a01b0383166104d457604051634a1406b160e11b81526000600482015260240161030a565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156103e557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161054791815260200190565b60405180910390a350505050565b6001600160a01b03831661058057806002600082825461057591906107df565b909155506105f29050565b6001600160a01b038316600090815260208190526040902054818110156105d35760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161030a565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661060e5760028054829003905561062d565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161067291815260200190565b60405180910390a3505050565b60006020808352835180602085015260005b818110156106ad57858101830151858201604001528201610691565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146106e557600080fd5b919050565b600080604083850312156106fd57600080fd5b610706836106ce565b946020939093013593505050565b60008060006060848603121561072957600080fd5b610732846106ce565b9250610740602085016106ce565b9150604084013590509250925092565b60006020828403121561076257600080fd5b61076b826106ce565b9392505050565b6000806040838503121561078557600080fd5b61078e836106ce565b915061079c602084016106ce565b90509250929050565b600181811c908216806107b957607f821691505b6020821081036107d957634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561026e57634e487b7160e01b600052601160045260246000fdfea2646970667358221220a0546cb20736a3e51e4b2baab69d4778a796d38300f3537f4832bde963535f6964736f6c63430008180033",
    "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c8063386bc05a11610071578063386bc05a1461012357806340c10f191461013657806370a082311461014b57806395d89b4114610174578063a9059cbb1461017c578063dd62ed3e1461018f57600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101c8565b6040516100c3919061067f565b60405180910390f35b6100df6100da3660046106ea565b61025a565b60405190151581526020016100c3565b6002545b6040519081526020016100c3565b6100df61010f366004610714565b610274565b604051601281526020016100c3565b6100df610131366004610714565b610298565b6101496101443660046106ea565b610328565b005b6100f3610159366004610750565b6001600160a01b031660009081526020819052604090205490565b6100b6610336565b6100df61018a3660046106ea565b610345565b6100f361019d366004610772565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101d7906107a5565b80601f0160208091040260200160405190810160405280929190818152602001828054610203906107a5565b80156102505780601f1061022557610100808354040283529160200191610250565b820191906000526020600020905b81548152906001019060200180831161023357829003601f168201915b5050505050905090565b60003361026881858561035b565b60019150505b92915050565b60003361028285828561036d565b61028d8585856103eb565b506001949350505050565b6001600160a01b0383166000908152602081905260408120548211156103135760405162461bcd60e51b815260206004820152602560248201527f496e73756666696369656e7420616d6f756e7420696e20646f6e6f7227732077604482015264185b1b195d60da1b60648201526084015b60405180910390fd5b61031e8484846103eb565b5060019392505050565b610332828261044a565b5050565b6060600480546101d7906107a5565b60006103523384846103eb565b50600192915050565b6103688383836001610480565b505050565b6001600160a01b0383811660009081526001602090815260408083209386168352929052205460001981146103e557818110156103d657604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161030a565b6103e584848484036000610480565b50505050565b6001600160a01b03831661041557604051634b637e8f60e11b81526000600482015260240161030a565b6001600160a01b03821661043f5760405163ec442f0560e01b81526000600482015260240161030a565b610368838383610555565b6001600160a01b0382166104745760405163ec442f0560e01b81526000600482015260240161030a565b61033260008383610555565b6001600160a01b0384166104aa5760405163e602df0560e01b81526000600482015260240161030a565b6001600160a01b0383166104d457604051634a1406b160e11b81526000600482015260240161030a565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156103e557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161054791815260200190565b60405180910390a350505050565b6001600160a01b03831661058057806002600082825461057591906107df565b909155506105f29050565b6001600160a01b038316600090815260208190526040902054818110156105d35760405163391434e360e21b81526001600160a01b0385166004820152602481018290526044810183905260640161030a565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661060e5760028054829003905561062d565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161067291815260200190565b60405180910390a3505050565b60006020808352835180602085015260005b818110156106ad57858101830151858201604001528201610691565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146106e557600080fd5b919050565b600080604083850312156106fd57600080fd5b610706836106ce565b946020939093013593505050565b60008060006060848603121561072957600080fd5b610732846106ce565b9250610740602085016106ce565b9150604084013590509250925092565b60006020828403121561076257600080fd5b61076b826106ce565b9392505050565b6000806040838503121561078557600080fd5b61078e836106ce565b915061079c602084016106ce565b90509250929050565b600181811c908216806107b957607f821691505b6020821081036107d957634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561026e57634e487b7160e01b600052601160045260246000fdfea2646970667358221220a0546cb20736a3e51e4b2baab69d4778a796d38300f3537f4832bde963535f6964736f6c63430008180033",
    "linkReferences": {},
    "deployedLinkReferences": {}
  }
  
  