/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils','knockout','utils/animation.util','ojs/ojasyncvalidator-regexp','ojs/ojvalidationgroup','ojs/ojdatetimepicker','ojs/ojbutton'],
 function(accUtils, ko, animationUtil, AsyncRegExpValidator) {
    function DashboardViewModel() {
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      var self = this;

      self.parentHoodQuote = "There really are places in the heart you don’t even know exist until you love a child. —Anne Lamott";
      var childBlessedQuoteBase = "Congratulations on parenthood 🙂";
      self.childBlessedQuote = ko.observable(childBlessedQuoteBase);

      self.labels = {
        firstname: 'First Name',
        lastname: 'Last Name',
        nickname: 'Nickname',
        dob: 'Date of Birth'
      };

      self.placeholders = {
        firstname: ko.observable('Please enter your child\'s first name'),
        lastname: ko.observable('Please enter your child\'s last name'),
        nickname: ko.observable('Please enter your child\'s nickname'),
        dob: 'mm/dd/yyyy'
      };

      self.textValidators = [
        new AsyncRegExpValidator({
            pattern: '[a-zA-Z]+',
            messageDetail: 'Please enter alphabets only.'
        })
      ];

      self.request = {
        firstname: ko.observable(""),
        lastname: ko.observable(""),
        nickname: ko.observable(""),
        dob: ko.observable("")
      };

      self.isShowAddChildForm = ko.observable(false);

      self.addChild = () => {
        var addChildValidationGroup = document.getElementById('addChildValidationGroup');
        if('valid' != addChildValidationGroup.valid){
          addChildValidationGroup.showMessages();
          addChildValidationGroup.focusOn('@firstInvalidShown');
          return false;
        }

      };

      self.initiateAddChild = (d, e) => {
        console.log('Chosen ' + e.currentTarget.id);
        self.placeholders.firstname(self.placeholders.firstname().replaceAll("child", e.currentTarget.id).replaceAll("son", e.currentTarget.id).replaceAll("daughter", e.currentTarget.id));
        self.placeholders.lastname(self.placeholders.lastname().replaceAll("child", e.currentTarget.id).replaceAll("son", e.currentTarget.id).replaceAll("daughter", e.currentTarget.id));
        self.placeholders.nickname(self.placeholders.nickname().replaceAll("child", e.currentTarget.id).replaceAll("son", e.currentTarget.id).replaceAll("daughter", e.currentTarget.id));
        //self.childBlessedQuote(self.childBlessedQuote().replaceAll("-", "a " + e.currentTarget.id));
        animationUtil.animate('childOptions', 'fadeOut')
        .then(() => {
          self.isShowAddChildForm(true);
        })
        .then(() => {
          animationUtil.animate('addChildFields', 'zoomIn');
        })
        .catch((err) => {
          console.log(err);
        });
        

      };

      self.showChildOptions = () => {
        //self.childBlessedQuote(childBlessedQuoteBase);
        animationUtil.animate('addChildFields', 'fadeOut')
        .then(() => {
          self.isShowAddChildForm(false);
          self.request.firstname("");
          self.request.lastname("");
          self.request.dob("");
        })
        .then(() => {
          animationUtil.animate('childOptions', 'zoomIn');
        })
        .catch((err) => {
          console.log(err);
        });
        
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        //accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
