import { useWallet } from "@solana/wallet-adapter-react";
import { ShowSolBalance } from "./balance";
import { AirdropWallet } from "./AirDrop";
import { MessageSigning } from "./MessageSigning";
import { TransactSol } from "./TransactSol";

export default function OnConnectCard () {
    const wallet = useWallet();
    return(
        <>
        {
            wallet.connected ?
            <div>
                <ShowSolBalance />
                <AirdropWallet />
                <MessageSigning />
                <TransactSol />
            </div> :
            <div>
                Connect A wallet           
            </div>

        }
        </>
    )
}