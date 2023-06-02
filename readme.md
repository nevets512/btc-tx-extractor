# Bitcoin Transaction Analyzer

This Node.js script, `getTxDetails.js`, retrieves transaction data for a list of Bitcoin transaction hashes and outputs it in CSV format. 

## Description
The script reads from a CSV file named `transaction_hashes.csv` which contains the transaction hashes to be processed. For each hash, it makes an HTTP request to the Blockstream API to fetch the corresponding transaction data, then structures this data into a format that represents both the input and output sides of each transaction.

The formatted data includes details such as transaction hash, involved Bitcoin address, amount transferred (in BTC), time of transaction, transaction fees (if applicable), and the block number in the blockchain where the transaction resides.

Once all transaction details are fetched and formatted, the data is then written into a new CSV file, `transactions.csv`.

## Features
- Retrieve Bitcoin transaction data using Blockstream API.
- Parse CSV files and write data into them.
- Handle promises for asynchronous data retrieval.
- Handle errors for API requests and filesystem operations.

## Dependencies
- axios: For making HTTP requests.
- csv-parser: For parsing CSV data.
- json2csv: For converting JSON data to CSV.
- fs: Node.js built-in module for reading from and writing to the filesystem.

## Usage
1. Ensure that a CSV file named `transaction_hashes.csv` is available in the same directory as the script, containing the transaction hashes to be processed.
2. Run the script with Node.js.

    ```
    node getTxDetails.js
    ```

3. After running the script, the output will be a new CSV file named `transactions.csv`. This file contains detailed information about both the input and output sides of each transaction.

## Output Format
Each row in the output CSV represents either an input or output of a transaction, including the following details:
- type: 'input' or 'output'
- transactionHash: The hash of the transaction
- address: The Bitcoin address involved
- amount: The amount of Bitcoin transferred, converted from satoshis to BTC
- time: The time of the transaction, as a JavaScript Date object
- fees: The transaction fee, in BTC (only included for the first input transaction)
- blockNumber: The number of the block in which the transaction was included

## Troubleshooting
If you encounter any issues while running the script, please check the console for error messages. Errors will be logged to the console when a request to the Blockstream API fails, or when the script encounters a problem reading from or writing to the filesystem.