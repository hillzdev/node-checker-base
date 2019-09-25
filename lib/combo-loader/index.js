const fs = require('fs');
const readline = require('readline');

module.exports.init = (input, callback) => {
    let combos = [];

    const combosRead = readline.createInterface(fs.createReadStream(input));

    combosRead.on('line', data => {
        if (data.includes(':')) {
            combos.push(data);
        }
    });

    combosRead.on('close', () => callback(combos));
};
