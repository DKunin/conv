'use strict';

const https = require('https');


module.exports = function(amount, fromCurrency, toCurrency) {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'exchangeratesapi.io',
            path: `/api/latest?base=${toCurrency.toUpperCase()}&symbols=${fromCurrency.toUpperCase()}`,
            headers: {
                Accept: 'application/json'
            }
        };
        https
            .get(options, function(response) {
                let str = '';
                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    const jsonResult = JSON.parse(str);
                    const { rates } = jsonResult;
                    const coef = rates[fromCurrency.toUpperCase()];
                    resolve((Number(amount) * coef).toFixed(2).toString());
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
