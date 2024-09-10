import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import OnConnectCard from './OnConnectCard';

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <div>
    <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]} autoConnect>
            <div className='absolute top-0 flex items-center justify-between px-4 py-2 border-b-2 w-full'>
              <WalletModalProvider>
                  <WalletMultiButton />
              </WalletModalProvider> 
              <WalletDisconnectButton />
            </div>
            <div className='mt-20'>
              <OnConnectCard />
            </div>
          </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App