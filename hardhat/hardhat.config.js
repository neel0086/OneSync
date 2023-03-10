require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    ganche: {
      url: "http://127.0.0.1:7545",
      accounts: ['0x452e3973e9ea0077162d06c5ddac28895a9e946cf88271a7208b2f7e4b934e74']
    }
  }
};