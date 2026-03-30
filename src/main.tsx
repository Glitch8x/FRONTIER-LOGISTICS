import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import '@mysten/dapp-kit/dist/index.css';

// Configure the Sui Testnet network using the correct v2.x helper
const { networkConfig } = createNetworkConfig({
  testnet: { 
    url: getJsonRpcFullnodeUrl('testnet'),
    network: 'testnet' as any
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
