require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// const Sepolia_URL = "https://eth-sepolia.g.alchemy.com/v2/DV6F_KoGQGiqzUSxZDkPtWqR_hzSoYqz"
// const PRIVATE_KEY = "cf5b826e151041d439ee87765784d1216193e62b35d37337271a0a28f63c9bec"

// module.exports = {
//   solidity: "0.8.19",
//   networks: {
//     sepolia: {
//       url: Sepolia_URL,
//       accounts: [PRIVATE_KEY],
//     },
//   },
// };

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ['0xf209c7181aa945f737d67075dbd313724a426e6ac358469dc36b0b3246063d0d']
    }
  }
};