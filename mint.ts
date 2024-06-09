import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import secret from './guideSecret.json';
import { web3JsEddsa } from "@metaplex-foundation/umi-eddsa-web3js";
import { web3JsRpc } from "@metaplex-foundation/umi-rpc-web3js";
import { createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { TokenStandard, createAndMint } from "@metaplex-foundation/mpl-token-metadata";

const umi = createUmi("https://api.devnet.solana.com")
.use(web3JsEddsa())
.use(web3JsRpc("https://api.devnet.solana.com"))
.use(mplCandyMachine());

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
umi.use(signerIdentity(userWalletSigner));
const mint = generateSigner(umi)


const metadata = {
    name: 'SuperTeam XP',
    symbol: 'SXP',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThWhydK32kyObvTD3wg4QBr4Rxyb0zzFudhQ&s',
   
}

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 6,
    amount: 100000000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
    console.log(`successfully minted 100 million tokens ${mint.publicKey}`)
})


