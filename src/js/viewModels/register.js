define(['jquery', 'knockout', 'utils/router.util', 'text!config/configuration.json', 'ojs/ojasyncvalidator-regexp', 'accUtils', 'cryptojs/crypto-js', 'ojs/ojcore', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojvalidationgroup', 'ojs/ojdataprovider'],
function($, ko, routerUtil, config, AsyncRegExpValidator, accUtils, cryptojs, RouterUtils){
    function registrationProcessor(){
        var self = this;
        self.request = {
            firstname: ko.observable(""),
            lastname: ko.observable(""),
            email: ko.observable(""),
            phone: ko.observable(""),
            username: ko.observable(""),
            password: ko.observable(""),
            confirmpassword: ko.observable("")
        };

        self.labels = {
            firstname: 'First Name',
            lastname: 'Last Name',
            email: 'Email Address',
            phone: 'Phone Number',
            username: 'Username',
            password: 'Password',
            confirmpassword: 'Confirm Password'
        };
        
        self.placeholders = {
            firstname: 'Please enter your first name',
            lastname: 'Please enter your last name',
            email: 'Please enter your email address',
            phone: 'Please enter your phone number',
            username: 'Please enter your desired username',
            password: 'Please enter your desired password',
            confirmpassword: 'Please re-enter your password'
        };
        
        self.helpInstructions = {
            password: 'Please enter a combination of uppercase, lowercase, digits and special characters.',
            phone: 'Please enter 10 digits only.',
            username: 'Please enter at least one alphabet.'
        };
        
        self.textValidators = [
            new AsyncRegExpValidator({
                pattern: '[a-zA-Z]+',
                messageDetail: 'Please enter alphabets only.'
            })
        ];
        
        self.phoneValidators = [
            new AsyncRegExpValidator({
                pattern: '\\d{10}',
                messageDetail: 'Your phone number must contain 10 digits only.'
            }),
            {
                validate: async function(value){
                    if(!value){
                        return;
                    }
                    var data;
                    await $.get(JSON.parse(config).SERVICE_URL + '/validate/phone/' + encodeURIComponent(value), (data1) => {
                        data = data1;
                    });
                    if(data && !data.isValid){
                        throw new Error(data.messageDetail);
                    }
                }.bind(self)
            }
        ];
        
        self.usernameValidators = [
            new AsyncRegExpValidator({
                pattern: '^(?=.*[a-zA-Z]+)(?=.*.).*$',
                messageDetail: 'Your username must contain at least one alphabet.'
            }),
            {
                validate: async function(value){
                    if(!value){
                        return;
                    }
                    var data;
                    await $.get(JSON.parse(config).SERVICE_URL + '/validate/username/' + encodeURIComponent(value), (data1) => {
                        data = data1;
                    });
                    if(data && !data.isValid){
                        throw new Error(data.messageDetail);
                    }
                }.bind(self)
            }
        ];
        
        self.passwordValidators = [
            new AsyncRegExpValidator({
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).*$',
                messageSummary: 'Password is not strong enough',
                messageDetail: 'Your password must contain a combination of uppercase, lowercase, digits and special characters.'
            }),
            new AsyncRegExpValidator({
                pattern: '^(?=.*\\D$)(?=.*^\\D).*$',
                messageDetail: 'Your password cannot begin or end with digits.'
            })
        ];

        self.confirmPasswordValidators = [{
            validate: function(value){
                if(document.getElementById('password').rawValue != value){
                    throw new Error("The passwords must match!");
                }
            }.bind(self)
        }];
    
        self.request.password.subscribe((newValue) => {
            var confirmPasswordElement = document.getElementById('confirmpassword');
            if(confirmPasswordTouched && confirmPasswordElement){
                confirmPasswordElement.validate();
            }
        });
        
        var confirmPasswordTouched = false;
        self.request.confirmpassword.subscribe(() => {
            confirmPasswordTouched = true;
        });
        
        self.emailValidators = [
            new AsyncRegExpValidator({
                pattern: '([^@]+)([@])([a-zA-Z\d]+)([.])([a-zA-Z\d]+)',
                messageDetail: 'Please enter a valid email address.'
            }),
            {
                validate: async function(value){
                    if(!value){
                        return;
                    }
                    var data;
                    await $.get(JSON.parse(config).SERVICE_URL + '/validate/email/' + encodeURIComponent(value), (data1) => {
                        data = data1;
                    });
                    if(data && !data.isValid){
                        throw new Error(data.messageDetail);
                    }
                }.bind(self)
            }
        ];
        
        self.register = () => {
            var registrationValidationGroup = document.getElementById("registrationValidationGroup");
            if(registrationValidationGroup.valid != "valid"){
                registrationValidationGroup.showMessages();
                registrationValidationGroup.focusOn("@firstInvalidShown");
                return false;
            }
            var registrationRequest = {
                firstname: self.request.firstname(),
                lastname: self.request.lastname(),
                email: self.request.email(),
                phone: self.request.phone(),
                username: self.request.username(),
                password: cryptojs.SHA512(self.request.password()).toString(cryptojs.enc.Base64)
            };
            console.log(registrationRequest);
            
            $.post(JSON.parse(config).SERVICE_URL + '/register', registrationRequest, (data) => {
                return data;
            }).done((data) => {
                accUtils.announce(data[0].messageDetail, 'assertive');
                self.navLogin();
            }).fail(() => {
                accUtils.announce("Something went wrong. Please try again later", 'error');
            });
        }
        
        self.isUsernameExists = () => {
            
        }
        
        self.connected = () => {
            //routerUtil.showNavigationItems();
        }
        
        self.disconnected = () => {
            resetFields();
        }

        var resetFields = () => {
            self.request.firstname("");
            self.request.lastname("");
            self.request.email("");
            self.request.phone("");
            self.request.username("");
            self.request.password("");
            self.request.confirmpassword("");
        }
        
        self.navLogin = () => {
            routerUtil.navLogin();
        }
    }
    
    return new registrationProcessor();
    
});