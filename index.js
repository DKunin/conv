'use strict';

const http = require('http');

module.exports = function(amount, fromCurrency, toCurrency) {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'api.fixer.io',
            path: `/latest?symbols=${toCurrency.toUpperCase()}&base=${fromCurrency.toUpperCase()}`,
            headers: {
                Accept: 'application/json'
            }
        };
        http
            .get(options, function(response) {
                let str = '';
                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', function() {
                    const jsonResult = JSON.parse(str);
                    const { rates } = jsonResult;
                    const coef = rates[toCurrency.toUpperCase()];
                    resolve((Number(amount) * coef).toFixed(2).toString());
                });
            })
            .on('error', function(e) {
                reject(e);
            });
    });
};
