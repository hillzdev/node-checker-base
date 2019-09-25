const fs = require('fs');
const readline = require('readline');

let proxies = [];

let path;

module.exports.path = () => path;

const initialize = (input, callback) => {
    path = input;

    const proxiesRead = readline.createInterface(fs.createReadStream(input));

    proxiesRead.on('line', data => {
        if (data.includes(':')) {
            proxies.push(data.split(':'));
        }
    });

    proxiesRead.on('close', () => callback());
};

module.exports.init = (input, callback) => initialize(input, callback);

const getProxy = (callback) => {
    if (proxies.length == 0) {
        initialize(path, () => {
            return getProxy(callback);
        });
    } else {
        callback(proxies.splice(0, 1)[0]);
    }
};

module.exports.get = (callback) => getProxy(callback);
