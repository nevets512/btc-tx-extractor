const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const { Parser } = require('json2csv');

async function getTransactionData(hash) {
    try {
        const response = await axios.get(`https://blockstream.info/api/tx/${hash}`);
        const transaction = response.data;
        const fees = transaction.fee ? transaction.fee / 1e8 : null; // convert from satoshis to BTC

        const inputData = transaction.vin.flatMap((input, i) => 
            (input.prevout.scriptpubkey_address ? [{
                type: 'input',
                transactionHash: transaction.txid,
                address: input.prevout.scriptpubkey_address,
                amount: -input.prevout.value / 1e8, // convert from satoshis to BTC
                time: new Date(transaction.status.block_time * 1000), // Convert UNIX timestamp to JavaScript Date object
                fees: i === 0 ? fees : null, // only attach fees to the first input transaction
                blockNumber: transaction.status.block_height,
            }] : [])
        );

        const outputData = transaction.vout.flatMap(output => 
            (output.scriptpubkey_address ? [{
                type: 'output',
                transactionHash: transaction.txid,
                address: output.scriptpubkey_address,
                amount: output.value / 1e8, // convert from satoshis to BTC
                time: new Date(transaction.status.block_time * 1000), // Convert UNIX timestamp to JavaScript Date object
                blockNumber: transaction.status.block_height,
            }] : [])
        );

        return [...inputData, ...outputData];
    } catch (error) {
        console.error(error);
    }
}

const promises = [];

fs.createReadStream('transaction_hashes.csv')
    .pipe(csvParser())
    .on('data', (row) => {
        promises.push(getTransactionData(row.hash));
    })
    .on('end', () => {
        Promise.allSettled(promises)
            .then((results) => {
                const fulfilledResults = results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => result.value)
                    .flat(); // flatten the array

                if (fulfilledResults.length > 0) {
                    const firstDefinedItem = fulfilledResults[0];
                    const json2csvParser = new Parser({ fields: Object.keys(firstDefinedItem) });
                    const csv = json2csvParser.parse(fulfilledResults);
                    fs.writeFileSync('transactions.csv', csv);
                }
            })
            .catch((error) => console.error(error));
    });
