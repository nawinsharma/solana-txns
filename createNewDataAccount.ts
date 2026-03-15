import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import fs from "fs";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const RPC_URL = HELIUS_API_KEY
  ? `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL);
const kp = Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync("keypair.json", "utf8"))));


// create a new data account for the token program and allocate some lamports and space to the new account and return the public key of the new account 
async function createNewDataAccount(){
    const newPublicKey = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(165);
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: kp.publicKey,
            newAccountPubkey: newPublicKey.publicKey,
            space: 165,
            programId: TOKEN_PROGRAM_ID,
            lamports,
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [kp, newPublicKey]);
    console.log("Transaction signature: ", signature);
    return newPublicKey.publicKey;
}

createNewDataAccount().then(() => {
    console.log("Done");
}).catch((error) => {
    console.error(error);
});