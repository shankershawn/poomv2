define(['jquery', 'text!config/configuration.json'], function($, config) {
    function jwtUtil(){
        var self = this;

        self.verify = () => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: JSON.parse(config).SERVICE_URL + '/verify',
                    method: 'GET',
                    headers: {
                        "authorization": "Bearer " + window.localStorage.getItem("fvgf"),
                        "x-auth-type": window.localStorage.getItem("tfdv")
                    },
                    success: (data) => {
                        resolve(data);
                    },
                    error: (err) => {
                        window.localStorage.removeItem('fvgf');
                        window.localStorage.removeItem('tfdv');
                        reject(err);
                    }
                });
            });
        };
    }
    return new jwtUtil();
    
});