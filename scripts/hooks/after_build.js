/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

const fs = require('fs');

'use strict';

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
    console.log("Running after_build hook.");    
    fs.writeFile('./src/js/config/configuration.json', '', (err) => {
      if(err) return console.log(err);
      console.log("Cleared ./src/js/config/configuration.json");
      resolve(configObj);
    });
  });
};
