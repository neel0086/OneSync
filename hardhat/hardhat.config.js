require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ['0x62e61a97d4f0569b8b5d8f00cc361df2a2ca488e490ab29413c9df811c038f47']
    }
  }
};