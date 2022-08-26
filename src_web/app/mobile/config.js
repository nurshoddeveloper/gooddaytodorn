module.exports = {

    // this is                     MOBILE
    platform: {
        mobile: true,
        web: false
    },

    nativeApp: true,

    version: '11-17-1',

    // LIVE-PRODUCTION CONFIG
    apiUrl: "https://www.goodday.work/api/app/",
    authApi: "https://www.goodday.work/api/auth/",
    presenceUrl: "www.goodday.work/presence/",


    //apiUrl: "http://192.168.0.57:8080/",
    //authApi: "http://192.168.0.57:8083/",


    //https://s3.us-east-2.amazonaws.com/goodday-work-east/U48GJt/1dc8a4d4-0737-11e8-be64-525400cb495b/original
    amazonImagePrefix: 'https://s3.us-east-2.amazonaws.com/goodday-work-east/',



    // DEV LIVE
    // apiUrl: "https://m.goodday.work/api/app/",
    // authApi: "https://m.goodday.work/api/auth/",
    // presenceUrl: "m.goodday.work/presence/",

    // VIC LOCAL
    // apiUrl: "http://api.goodday.loc:8081/",
    // authApi: "http://api.goodday.loc:8083/",
    // presenceUrl: 'api.goodday.loc:8090/presence',

    // YURA LOCAL
    // apiUrl: "http://192.168.239.128:8080/",
    // presenceUrl: "192.168.239.128:8081/presence",

    routing: () => {}, //require('./gd/router/main.js'),
    //routing: require('./core/gd/router/dev'),

    devMode: true,

    defaultSkin: 'blue',

    skins: {
        blue: {
            name: 'blue',
            color: '#0b7fc3'
        }
    },

    assetsPath: 'https://www.goodday.work/app/web/',
    //mediaPath: '/media/',
    mediaPath: 'https://www.goodday.work/media/'
};