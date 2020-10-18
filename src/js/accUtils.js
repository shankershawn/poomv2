/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojanimation'],
  function () {
    /**
     * Method for sending notifications to the aria-live region for Accessibility.
     * Sending a notice when the page is loaded, as well as changing the page title
     * is considered best practice for making Single Page Applications Accessbible.
     */
    var validAriaLiveValues = ['off', 'polite', 'assertive', 'warning', 'error'];
    self.announce = function (message, manner) {
      if (manner == undefined || !validAriaLiveValues.includes(manner)) {
        manner = 'polite';
      }
      switch(manner){
          case 'polite':
              document.getElementById('announce').style.backgroundColor = "forestgreen"; break;
          case 'assertive':
              document.getElementById('announce').style.backgroundColor = "forestgreen"; break;
          case 'warning':
              document.getElementById('announce').style.backgroundColor = "gold"; break;
          case 'error':
              document.getElementById('announce').style.backgroundColor = "red"; break;
          case 'off':
              return;
      }
      setTimeout(() => {
          document.getElementById('announce').style.visibility = 'visible';
          oj.AnimationUtils['expand'](document.getElementById('announce'), {timingFunction: 'linear'})
          .then(() => {
              setTimeout(() => {
                  oj.AnimationUtils['collapse'](document.getElementById('announce'), {timingFunction: 'linear'}).then(() => {
                      document.getElementById('announce').style.visibility = 'hidden';
                  });
              },2000);
          });
      },500);
      var params = {
        'bubbles': true,
        'detail': { 'message': message}
      };
      document.getElementById('globalBody').dispatchEvent(new CustomEvent('announce', params));
    }

    return { announce: announce };
  }
);
