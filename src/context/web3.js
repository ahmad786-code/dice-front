"use client";

// 1. Get projectId
export const projectId = 'f6b66e5531710181d66d05c454bbb721'

// 2. Set chains
export const mumbai = {
  chainId: 80001,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://rpc-mumbai.maticvigil.com/'
}

export const mainnet = {
  chainId: 8453,
  name: 'Base Chain',
  currency: 'BASE',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://base-rpc.publicnode.com'
}

// 3. Create modal
export const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'http://localhost:3000',
  icons: ['https://avatars.mywebsite.com/']
}

export const gameContractAddress = '0x340B23f52a562E35fC1376a2260AF23FaD58Bfac'
export const usdtContractAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed'

export function Web3ModalProvider({ children }) {
  return children;
}
export const isValidNetwork = () => {
  const chainId = mainnet.chainId
  return window.ethereum.net_version === chainId
}
export const changeNetwork = async () => {
  const chainId = mainnet.chainId
  if (window.ethereum) {
    console.log(window.ethereum.networkVersion)
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }]
        });
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Base Mainnet',
                chainId: '0x2105',
                nativeCurrency: { name: 'Base', decimals: 18, symbol: 'ETH' },
                rpcUrls: [mainnet.rpcUrl]
              }
            ]
          });
        }
      }
    }
  }
}