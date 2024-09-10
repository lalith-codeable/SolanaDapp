import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react"
import { balanceAtom } from "../recoil/atoms";
import { useRecoilState } from "recoil"
import { fetchBalance } from "../libs/aux";

export function TransactSol () {
    const [ address, setAddress ] = useState("");
    const [ addressNotValid, setAddressNotValid] = useState(true)
    const [ sendAmount, setSendAmount ] = useState(0);
    const [ balance, setBalance ] = useRecoilState(balanceAtom);
    const { connection } = useConnection();
    const wallet = useWallet();
    const fees = 0.000005;

    const handleAddress = (e : React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
        const address = e.target.value;
        if(regex.test(address)){
            setAddress(address);
        }
        if(address.length >= 32){
            setAddressNotValid(false);
        }
    }

    const handleAmount = (e : React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(e.target.value);
        if(Number.isNaN(parsedValue)){
            setSendAmount(0);
            return;
        }
        setSendAmount(parseFloat(e.target.value));
    }

    const handleTransaction = async () => {
        const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        
        if(!wallet.connected || !wallet.publicKey){
            alert("Wallet not connected");
            return
        }

        if(!regex.test(address)){
            alert("Invalid solana address");
            setAddress("");
            setSendAmount(0);
        }
        
        await fetchBalance({
            publicKey: wallet.publicKey,
            connection: connection,
            setBalance: setBalance
        })

        if(balance < sendAmount+fees){
            alert(`Insufficient balance: ${balance}`)
            return;
        }
        
        try{
            const transaction = new Transaction();
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(address),
                    lamports: sendAmount * LAMPORTS_PER_SOL
                })
            )
            await wallet.sendTransaction(transaction, connection);
            await new Promise(resolve => setTimeout(resolve,5000));
            await fetchBalance({
                publicKey: wallet.publicKey,
                connection: connection,
                setBalance: setBalance
            })
            alert(`successfully sent ${sendAmount} to ${address}`)
        }
        catch(e: any){
            console.warn(e);
            alert(e);
        }    
        
    }
    return (
        <div>
            <span className="flex gap-2">
                <h3>Recipents Address:</h3>
                <input 
                    type="text" 
                    name="RecAddress"
                    placeholder="solana address"
                    value={address}
                    onChange={handleAddress}
                    className="border bg-blue-200 rounded-md p-1"
                />
            </span>
            <input 
                type="number" 
                name="sendAmount"  
                placeholder="Amount"
                value={sendAmount === 0 ? "" : sendAmount}
                onChange={handleAmount}
                className="border bg-blue-200 rounded-md p-1"
            />
            <span
                className="border-1 border-green-600 bg-white text-green-700 p-2 rounded-md"
            >
                Total Amount payable: {sendAmount === 0 ? "none" : `${sendAmount} + ${fees} fees = ${sendAmount+fees}`}
            </span>
            <button
                onClick={handleTransaction}
                disabled={addressNotValid}
                className="border rounded-md p-2"
            >
                transact SOL
            </button>
        </div>
    )
}