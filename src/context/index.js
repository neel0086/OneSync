import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, useAccount, WagmiConfig} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { useContext, createContext} from 'react';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import abi from '../contractsData/meddata.json';
import contractAddress from '../contractsData/meddata-address.json'



const ganache = {
    id: 1337,
    name: 'Ganache',
    network: 'Ganache',
    iconUrl: 'https://www.trufflesuite.com/img/ganache-logo-dark.svg',
    iconBackground: '#fff',
    nativeCurrency: {
        decimals: 18,
        name: 'Ganache Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['HTTP://127.0.0.1:7545'],
        },
    },
    blockExplorers: {
        default: { name: 'Ganache Explorer', url: 'HTTP://127.0.0.1:7545' },
    },
    testnet: true,
};




const { chains, provider } = configureChains(
    [ganache],
    [
        jsonRpcProvider({
            rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
        }),
    ]
);


const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const stateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const contractABI = abi.abi;
    const { address, isConnecting } = useAccount();

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <stateContext.Provider
                    value={{
                        address,
                        contractAddress,
                        contractABI,
                        isConnecting,
                    }}
                >
                    {children}
                </stateContext.Provider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export const useStateContext = () => useContext(stateContext);


