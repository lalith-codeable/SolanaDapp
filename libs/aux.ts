import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface FetchBalanceParams {
    publicKey: PublicKey | null;
    connection: Connection;
    setBalance: ( balance: number) => void;
}
export async function fetchBalance ({publicKey, connection, setBalance }: FetchBalanceParams){
    if(publicKey){
        const fetchedLamports = await connection.getBalance(publicKey,"confirmed");
        if(fetchedLamports){
            setBalance(fetchedLamports/LAMPORTS_PER_SOL);
            return fetchedLamports/LAMPORTS_PER_SOL;
        }
    }
} 
