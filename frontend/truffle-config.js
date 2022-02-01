require('babel-register');
require('babel-polyfill');

// module.exports = {
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "*", // Match any network id
//       gas: 16721975
//     },
//   },
//   contracts_directory: './src/contracts/',
//   contracts_build_directory: './src/abis/',
//   compilers: {
//     solc: {
//       version: "0.8.0",
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
//   plugins: ["truffle-contract-size"]
// }

//org https://data-seed-prebsc-1-s1.binance.org:8545
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { mnemonic } = require('./secret.json');;


console.log(process.env.WALLET_SECRET)
module.exports = {
  // networks: {
  //   development: {
  //     host: "127.0.0.1",     // Localhost (default: none)
  //     port: 7545,            // Standard BSC port (default: none)
  //     network_id: "*",       // Any network (default: none)
  //   },
  //   testnet: {
  //     provider: () => new HDWalletProvider(mnemonic, `wss://speedy-nodes-nyc.moralis.io/86acbed37d786c1214dced26/bsc/testnet/ws`),
  //     network_id: 97,
  //     confirmations: 10,
  //     timeoutBlocks: 200,
  //     skipDryRun: true,
  //     networkCheckTimeout: 999999,
  //     gas: 5500000,
  //     websockets: true
  //   },
  //   bsc: {
  //     provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
  //     network_id: 56,
  //     confirmations: 10,
  //     timeoutBlocks: 200,
  //     skipDryRun: true
  //   },
  //   avaxtestnet: {
  //     provider: () => new HDWalletProvider(mnemonic, `https://api.avax-test.network/ext/bc/C/rpc`),
  //     network_id: 43113,
  //     confirmations: 10,
  //     timeoutBlocks: 200,
  //     skipDryRun: true
  //   },
  // },

  // Set default mocha options here, use special reporters etc.
  // mocha: {
  //   enableTimeouts: false,
  //   before_timeout: 600000,
  //   timeout: 600000,
  //   bail: false,
  //   retries: 100
  // },
  networks: {
    avax: {
      provider: () => {
        return new HDWalletProvider(mnemonic ,"https://api.avax-test.network/ext/bc/C/rpc");
      },
      network_id: "*",
      gas: 5500000,
      gasPrice: 225000000000,
    },
  },

  // Configure compilers
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  plugins: ["truffle-contract-size"]
}