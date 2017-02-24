const chai = require('chai');
const Should = chai.Should();
const express = require('express');
const router = express.Router();
const helperFtn = require('../utilities/helperFunctions.js');

let expect = chai.expect;
var should = require('chai').should();

describe('getCityFromIP', () => {
    it('should be an function', () => {
        //console.log(router);
        helperFtn.getCityFromIP.should.be.an('function');
    });
    it('should return a promise', () => {
        helperFtn.getCityFromIP("100.105.14.101").should.be.a('promise');
    });
});

describe('getCityStats', () => {
   it ('should be a function', () =>{
       helperFtn.getCityStats.should.be.a('function');
   });
    it ('should return a promise', () =>{
        helperFtn.getCityStats('Belgrade').should.be.a('promise');
    });
});

describe('getGeoJSON', () => {
    it ('should be a function', () =>{
        helperFtn.getGeoJSON.should.be.a('function');
    });
    it ('should return a promise', () =>{
        helperFtn.getGeoJSON('100.105.14.101').should.be.a('promise');
    });
});
