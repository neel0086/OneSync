require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

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