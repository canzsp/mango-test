import os
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Environment variables
RPC_URL = os.getenv("RPC_URL")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
TOKEN_IN = os.getenv("TOKEN_IN")
TOKEN_OUT = os.getenv("TOKEN_OUT")
ROUTER_ADDRESS = os.getenv("ROUTER_ADDRESS")

# Web3 setup
web3 = Web3(Web3.HTTPProvider(RPC_URL))
if not web3.isConnected():
    raise ConnectionError("Failed to connect to blockchain")

# Router contract ABI (replace with actual ABI)
ROUTER_ABI = [
    # Add the ABI here
]

router_contract = web3.eth.contract(address=ROUTER_ADDRESS, abi=ROUTER_ABI)

def auto_swap(amount_in, amount_out_min, deadline):
    """
    Perform a token swap.
    """
    try:
        # Prepare transaction
        transaction = router_contract.functions.swapExactTokensForTokens(
            web3.toWei(amount_in, 'ether'),  # Amount of TOKEN_IN
            web3.toWei(amount_out_min, 'ether'),  # Minimum amount of TOKEN_OUT
            [TOKEN_IN, TOKEN_OUT],  # Path: TOKEN_IN -> TOKEN_OUT
            WALLET_ADDRESS,  # Recipient
            deadline  # Deadline (timestamp)
        )

        # Estimate gas and get gas price
        gas = transaction.estimateGas({'from': WALLET_ADDRESS})
        gas_price = web3.eth.gas_price

        # Build transaction
        tx = transaction.buildTransaction({
            'from': WALLET_ADDRESS,
            'gas': gas,
            'gasPrice': gas_price,
            'nonce': web3.eth.getTransactionCount(WALLET_ADDRESS)
