define(['../appController','ojs/ojanimation'],
function(app, ){
    function processRoute(){
        var self = this;
        
        /*self.navigate = function(stateId){
            app.router.go(stateId);
        };
        
        self.configureRoute = function(routeConfig){
            app.router = Router.rootInstance;
            app.router.configure(routeConfig);
        };
        
        self.setNavData = function(navData){
            hideNavigationItems();
            app.navData(navData);
        };
        
        self.navLogin = () => {
            self.configureRoute({'login': {label: 'Login', isDefault: true}});
            self.setNavData([{name: 'Login', id: 'login', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'}]);
            self.navigate('login');
        };
        
        function hideNavigationItems(){
            Array.from(document.getElementById('ui-id-2').children).forEach(li => li.style.visibility = "hidden");
            document.getElementById('ui-id-2').style.visibility = "hidden";
        };

        self.showNavigationItems = function(){
            document.getElementById('ui-id-2').style.visibility = "visible";
        };

        */

        self.toggleProfileMenuDisplay = (isShowProfileMenu) => {
            app.isShowProfileMenu(isShowProfileMenu);
        };

        self.navLogin = () => {
          self.navigate([
              { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-login', isDefault: true } }
          ]);
      }

        self.navigate = (navData) => {
          oj.AnimationUtils['fadeOut'](document.getElementById('top-menu'), {timingFunction: 'ease' })
            .then(() => {
              document.getElementById('top-menu').style.visibility = 'hidden';
              app.router.go({path: navData.filter(e => undefined != e.detail && e.detail.isDefault == true)[0].path})
                .then(() => {
                  app.navData(navData);
                  console.log("Setting navData");
                  console.log("Syncing router");
                  app.router.sync();
                  return;
                })
                .then(() => {
                  oj.AnimationUtils['fadeIn'](document.getElementById('top-menu'), {timingFunction: 'ease', delay: '500ms' });
                })
                .then(() => {
                  document.getElementById('top-menu').style.visibility = 'visible';
                });
            })
            .catch((err) => {
              console.log(err);
            });
        };
    }
    return new processRoute();
});