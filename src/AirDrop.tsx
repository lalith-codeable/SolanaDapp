import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { balanceAtom } from '../recoil/atoms';
import { fetchBalance } from '../libs/aux';

export const AirdropWallet = () : JSX.Element => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [ amount, setAmount ] = useState(1);
    const setBalance = useSetRecoilState(balanceAtom);

    const handleAirdrop = async () => {
        if(!wallet.publicKey){
            alert("connect a wallet");
            return;
        }
        try{
            setAmount(1);
            await connection.requestAirdrop(wallet.publicKey, amount*LAMPORTS_PER_SOL);
            await new Promise(resolve => setTimeout(resolve,5000));
            await fetchBalance({
                publicKey: wallet.publicKey,
                connection: connection,
                setBalance: setBalance
            })
            alert(`Airdroped ${amount} SOL to ${wallet.publicKey.toBase58()}`);
        }
        catch(e : any)
        {
            alert("Airdrop limit reached or faucet is empty. Please try again later. Check console for more details.");
            console.warn(e);
        }
    }

    return (
        <div className='flex flex-row gap-2 w-2/4'>

            <span 
            className='flex items-center text-sm border p-1 rounded-md'
            >

                Airdrop Amount : 
                <button
                    className='p-1 text-green-700 font-bold'
                    onClick={() => { setAmount(( val ) => val + 1)}}
                >
                    {amount} Sol &#x2191;
                </button>
            </span>

            <button 
            onClick={handleAirdrop}
            className='py-2 px-4 border rounded-md bg-green-600 w-28'
            >
                Airdrop 
            </button>
        </div>
    )
}

