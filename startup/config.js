const config = require('config');
const express = require('express');
const app = express();
const helmet = require('helmet'); //helps secure apps by setting various HTTP headers

module.exports = function () {
    
    app.use(express.urlencoded({extended: true}));//key=value&key=value -> req.body. works for arrays and objects too
    app.use(express.static('public')); //used to serve static files in the public folder
    app.use(helmet());
        
    //ensure jwtPrivate key is set
    if(!process.env.jwtPrivateKey) {
        console.log('reached');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
      
    }
}