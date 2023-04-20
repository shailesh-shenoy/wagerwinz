
# WagerWinz

WagerWinz is a ETH based price prediction game where anyone can create a challenge and win SepoliaETH. 


Built using hardhat, nextjs, rainbowkit, and wagmi. Deployed to Sepolia Testnet and Vercel.




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

