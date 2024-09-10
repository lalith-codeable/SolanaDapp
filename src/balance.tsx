import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { balanceAtom } from "../recoil/atoms";
import { fetchBalance } from "../libs/aux";

export const ShowSolBalance = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useRecoilState(balanceAtom);

    useEffect(function(){       
        fetchBalance({
            publicKey: wallet.publicKey,
            connection: connection,
            setBalance: setBalance

        });
    },[])

    return (
        <div>
            <span>
                Balance :{balance} SOL
            </span>            
        </div>
    )
}