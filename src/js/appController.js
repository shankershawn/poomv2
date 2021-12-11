/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojknockouttemplateutils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojoffcanvas', 'text!config/configuration.json', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter',
        'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, KnockoutTemplateUtils, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils, config,
    CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter) {
     function ControllerViewModel() {

      var protocol = window.location.href.split("://")[0];
      if(protocol == 'http' && JSON.parse(config).SECURE_ONLY == "true"){
          window.open('https://' + window.location.href.split("://")[1], '_self');
      }

      var self = this;
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      self.setGToken = () => {
        var g_token = new URL(window.location.toString().replace('/#','/?')).searchParams.get("access_token");
        if(!!g_token){
            window.localStorage.setItem("fvgf", g_token);
            window.localStorage.setItem("tfdv","g");
            window.close();
        }
      }
    
      self.setGToken();

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      self.navData = ko.observableArray([
        { path: '', redirect: 'login' },
        { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-login' } },
        { path: 'register', detail: { label: 'Register', iconClass: 'oj-ux-ico-contact' } },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-dashboard' } },
        { path: 'timeline', detail: { label: 'Timeline', iconClass: 'oj-ux-ico-timeline' } },
        { path: 'documents', detail: { label: 'Documents', iconClass: 'oj-ux-ico-documents' } }
      ]);

      var states = self.navData().reduce((obj, currentItem, currentIndex) => {
        obj[currentItem.path] = currentIndex;
        return obj;
      }, {});

      // Router setup
      self.router = new CoreRouter(self.navData(), {
        urlAdapter: new UrlParamAdapter()
      });

      self.navData([
        { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-login', isDefault: true } }
      ]);

      var animateModuleTransition = function(context){
        console.log('inside animateModuleTransition');
        return context.previousViewModel ? 'fade' : 'zoomIn';
      };

      self.moduleAdapter = new ModuleRouterAdapter(self.router, {
        animationCallback: animateModuleTransition
      });

      self.selection = new KnockoutRouterAdapter(self.router);

      self.isShowProfileMenu = ko.observable(false);

      require(['utils/router.util', 'utils/jwt.util'], (routerUtil, jwtUtil) => {
        routerUtil.navigate([
          { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-login', isDefault: true } }
        ]);

        jwtUtil.verify()
        .then(() => {
          self.isShowProfileMenu(true);
        })
        .catch(() => {
          self.isShowProfileMenu(false);
        });
      });

      //self.router.sync();

      self.router.currentState.subscribe((args) => {
        console.log(args);
        //history.pushState('','','/');
      });

      this.navDataProvider = ko.computed(() => {
        var navData;
        if(self.navData()[0].path == ''){
          navData = self.navData().slice(1);
        }else{
          navData = self.navData();
        }
        return new ArrayDataProvider(navData, {keyAttributes: "path"});
      });
      
      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => {OffcanvasUtils.close(this.drawerParams);});
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("...for your little one");

      self.userMenuAction = async function(event){
          switch(event.detail.originalEvent.target.parentElement.id){
              case "out":
                  /*var token = window.localStorage.getItem('fvgf');
                  var auth_type = window.localStorage.getItem('tfdv');
                  window.localStorage.removeItem('fvgf');
                  window.localStorage.removeItem('tfdv');*/
                  var login = await require('./viewModels/login');
                  /*window.localStorage.setItem('fvgf', token);
                  window.localStorage.setItem('tfdv', auth_type);*/
                  await login.logout();
                  window.localStorage.removeItem('fvgf');
                  window.localStorage.removeItem('tfdv');
                  break;
          };
      };

      // Footer
      this.footerLinks = [
        {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
     }

     return new ControllerViewModel();
  }
);
