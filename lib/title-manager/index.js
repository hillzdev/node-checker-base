const setTitle = require('console-title');

let hits = 0;
let retries = 0;
let failures = 0;

let checkedCombos = 0;

let combosToCheck = 0;

let checkerTitle;

const update = () => setTitle(checkerTitle + " | " + checkedCombos + "/" + combosToCheck + " Checked | " + hits + " Hits | " + retries + " Retries | " + failures + " Failures");

module.exports.init = (title, count) => {
    checkerTitle = title;
    combosToCheck = count;

    update();
};

module.exports.hit = () => {
    hits++;

    update();
};

module.exports.retry = () => {
    retries++;

    update();
};

module.exports.failure = () => {
    failures++;

    update();
};

module.exports.checkedCombo = () => {
    checkedCombos++;

    update();
};