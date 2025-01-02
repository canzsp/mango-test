require('dotenv').config();
const Web3 = require('web3');

// Load environment variables
const RPC_URL = process.env.RPC_URL;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_IN = process.env.TOKEN_IN;
const TOKEN_OUT = process.env.TOKEN_OUT;
const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

const web3 = new Web3(RPC_URL);

// Router ABI (you need to replace this with the actual ABI of the router contract)
const routerAbi = [ /* Add the router contract ABI here */ ];
const routerContract = new web3.eth.Contract(routerAbi, ROUTER_ADDRESS);

// Swap function
async function autoSwap(amountIn, amountOutMin, deadline) {
    try {
        const tx = routerContract.methods.swapExactTokensForTokens(
            web3.utils.toWei(amountIn.toString(), 'ether'),
            web3.utils.toWei(amountOutMin.toString(), 'ether'),
            [TOKEN_IN, TOKEN_OUT],
            WALLET_ADDRESS,
            deadline
        );

        const gas = await tx.estimateGas({ from: WALLET_ADDRESS });
        const gasPrice = await web3.eth.getGasPrice();

        const txData = {
            from: WALLET_ADDRESS,
            to: ROUTER_ADDRESS,
            data: tx.encodeABI(),
            gas,
            gasPrice
        };

        const signedTx = await web3.eth.accounts.signTransaction(txData, PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log('Swap successful:', receipt);
    } catch (error) {
        console.error('Error during swap:', error);
    }
}

// Example usage
const amountIn = 1; // Amount of TOKEN_IN to swap
const amountOutMin = 0.9; // Minimum amount of TOKEN_OUT to receive
const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

autoSwap(amountIn, amountOutMin, deadline);
