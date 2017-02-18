const chai = require('chai');
const Should = chai.Should();
const express = require('express');
const router = express.Router();
const helperFtn = require('../utilities/helperFunctions.js');

describe('getCityFromIP', () => {
    it('should be an function', () => {
        //console.log(router);
        helperFtn.getCityFromIP.should.be.an('function');
    });
    it('should return a promise', () => {
        helperFtn.getCityFromIP("100.105.14.101").should.be.a('promise');
    });
});

