import { getAssociatedTokenAddressSync, unpackAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC_URL = HELIUS_API_KEY
  ? `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL);
const publicKey = new PublicKey("2Udfwqvq3YXoZs51FJFxHZ9L6cL2PERmgJASmwQkA5vw");
const mintAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // usdc mint address

async function getTokenBalance(publicKey: PublicKey, mintAddress: PublicKey){
    const ataAddress = getAssociatedTokenAddressSync(mintAddress, publicKey);
    const ataData = await connection.getAccountInfo(ataAddress);

    if (!ataData) {
        console.log("No token account for this mint — balance is 0");
        return 0n;
    }

    const innerData = unpackAccount(ataAddress, ataData);
    console.log(innerData.amount);
    return innerData.amount;
} 

async function getTokenBalanceRaw(publicKey: PublicKey, mintAddress: PublicKey){
    const [address] = PublicKey.findProgramAddressSync([
        publicKey.toBuffer(),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").toBuffer(),
        mintAddress.toBuffer(),
    ], new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"));

    const ataData = await connection.getAccountInfo(address);

    if (!ataData) {
        console.log("No token account for this mint — balance is 0");
        return 0n;
    }

    const innerData = unpackAccount(address, ataData);
    console.log(innerData.amount);
    return innerData.amount;
}

getTokenBalance(publicKey, mintAddress).then(() => {
    console.log("Done");
}).catch((error) => {
    console.error(error);
});