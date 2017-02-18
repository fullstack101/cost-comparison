const chai = require('chai');
const Should = chai.Should()
const express = require('express');
const router = express.Router();

describe('index', () => {
    it('should be an function', () => {
        //console.log(router);
        router.get.should.be.an('function');
    });
});

