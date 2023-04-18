# OneSync
## About the project
OneSync is a file storage and sharing platform that allows users to store and share their files with others. It also provides a platform for users to sell their files and earn revenue. With OneSync, users can easily upload and organize their files, share them with others, and manage their permissions. The platform is designed to be user-friendly and accessible, with a clean and modern interface that makes it easy to use.

In addition to its file sharing and storage features, OneSync also provides a marketplace for users to sell their files. This feature allows users to earn revenue by selling their work directly to customers, without the need for a third-party platform. OneSync provides all the tools users need to manage their sales, including a dashboard that allows them to track their sales and earnings. Overall, OneSync is a powerful platform for file storage, sharing, and sales, designed to meet the needs of both individuals.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [IPFS](https:ipfs://ipfs.tech/)(To store the files on peer to peer network)
- [Thirdweb](https://thirdweb.com/)(To use to upload the images to ipfs)
- Sepolia (The smartcontract is deployed on the sepolia testnet)
- [Rainbowkit/wagmi](https://www.rainbowkit.com/)(
  Out-of-the-box wallet management for your dapp)



## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

#### Configure  the hardhat.config.js file

```
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [YOUR_PRIVATE_KEY]
    }
  }
};
```
#### After that run the command

`$ npx hardhat run ./scripts/deploy.js --network sepolia`


### 5. Start frontend
`$ npm run start`

