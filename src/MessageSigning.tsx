import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519";

interface signedMessage {
    message: string;
    signature: string;
    verified: boolean;
}

export function MessageSigning () {
    const wallet = useWallet();
    const [ message, setMessage ] = useState("");
    const [ signHistory, setSignHistory ] = useState<signedMessage[]>([]); 

    const handleMessage = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handleSign = async () => {
        if(message === "")
        {
            alert("message space empty"); 
            return;
        }    
        if(!wallet.publicKey)
        {
            alert("wallet not connected"); 
            return;
        }     
        if(!wallet.signMessage)
        {
            alert("wallet does not support signing");
        }
        if(wallet.publicKey && wallet.signMessage){
            const trimedMessage = message.trim()
            const encodedMessage = new TextEncoder().encode(trimedMessage);
            const signature = await wallet.signMessage(encodedMessage);
            const verified = ed25519.verify(signature,encodedMessage,wallet.publicKey.toBytes());
    
            setSignHistory(
                (History) => {
                    return[
                        ...History,
                        {
                            message: trimedMessage,
                            signature: bs58.encode(signature),
                            verified
                        }
                    ]
                }
            )
        }
    }
    return (
        <div className="w-5/6 h-auto border-1 shadow-md mt-2">
            <div className="flex gap-2 items-center">
                <input 
                    type="text" 
                    name="message" 
                    value={message}
                    onChange={handleMessage}
                    placeholder="Message"
                    className="p-1 border-1 border-black rounded-md bg-blue-200 shadow-lg"
                />
                <button
                className="py-2 px-4 bg-red-600 rounded-md text-white"
                onClick={handleSign}
                > 
                    sign message
                </button>
            </div>
            <div className="w-auto mt-2 h-auto border-1 shadow-lg rounded-md">
                <h3 className="text-md">Signing History</h3>
                {
                    signHistory?.map(
                        (block)=> {
                            return (
                                <span className="flex flex-col" key={block.signature}>
                                    <p className="text-sm text-wrap">message : {block.message}</p>
                                    <p className="text-sm text-wrap">signature : {block.signature}</p>
                                    <p className="text-sm text-wrap">verified: <span className="text-green-700 font-bold">{block.verified ? "true" : "false"}</span></p>
                                </span>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}