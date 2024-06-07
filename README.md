
# WagerWinz

Live Link: https://wagerwinz.vercel.app/

WagerWinz is an ETH based price prediction game where anyone can create a wager based on the price of ETH, challenge someone and win SepoliaETH. 

Built using hardhat, nextjs, rainbowkit, and wagmi. Deployed to Sepolia Testnet and Vercel. 

Queries the Chainlink ETH/USD price Oracle and utilized the ContractFactory/Proxy pattern for the smart contracts  to ensure total transparency & decentralization


## Authors

- [@shailesh-shenoy](https://www.github.com/shailesh-shenoy)


## Run Locally

Clone the project

```bash
  git clone https://github.com/shailesh-shenoy/wagerwinz
```

Go to the project directory

```bash
  cd wagerwinz
```

Install dependencies

```bash
  yarn install
```

Start Hardhat local node

```bash
yarn chain
```

In another shell, deploy the smart contracts to local hardhat instance
```bash
  yarn deploy
```

Go into the frontend folder and install dependencies
```bash
  cd frontend
```

```bash
yarn install
```

Start the server
```bash
  yarn dev
```

The project should be started on http://localhost:3000

## Live on Sepolia Testnet

https://wagerwinz.vercel.app/

