import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import * as fs from 'fs';
import bs58 from 'bs58';

// STEP 1 - Connect to Solana network mainnet or devnet
const connection = new Connection(clusterApiUrl('devnet'));

// STEP 2 - Generate a new Solana wallet or get keypair from environment
const keypair = Keypair.generate();
console.log(`Generated new Keypair. Wallet Publickey is ${keypair.publicKey.toString()}`);

// STEP 3 - Write Wallet Secret key to a json file
const secretArray = Array.from(keypair.secretKey); // Convert secret key to an array of numbers
const secret = JSON.stringify(secretArray); // Convert to JSON string

const privateKey = bs58.encode(keypair.secretKey)
console.log(`Wallet Private key is : ${privateKey}`)

fs.writeFile('guideSecret.json', secret, 'utf-8', function (err) {
    if (err) throw err;
    console.log('Wrote secret key to guideSecret.json');
});

// STEP 4 - Airdrop 1 SOL to new wallet
(async () => {
    try {
        const airdropSignature = await connection.requestAirdrop(
            keypair.publicKey,
            LAMPORTS_PER_SOL,
        );

        console.log(`Airdrop Transaction Id: ${airdropSignature}`);
        console.log(`https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);
    } catch (error) {
        console.error('Airdrop failed:', error);
    }
})();
