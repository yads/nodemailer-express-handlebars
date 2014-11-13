'use strict';

var should = require('chai').should();
var nodemailerExpressHandlebars = require('../..'),
    nodemailer = require('nodemailer'),
    transport = require('nodemailer-stub-transport'),
    handlebars = require('express-handlebars'),
    path = require('path');

describe('when view engine passed', function() {

    var sut,
        mail,
        transporter,
        viewEngine;

    beforeEach(function() {
        transporter = nodemailer.createTransport(transport());
        viewEngine = handlebars.create({});
        sut = nodemailerExpressHandlebars({
            viewEngine: viewEngine,
            viewPath: path.resolve(__dirname, '../views')
        });
        transporter.use('compile', sut);
        mail = {
            from: 'from@domain.com',
            to: 'to@domain.com',
            subject: 'Test',
            template: 'email',
            context: {
                name: 'Name'
            }
        };
    });

    it('should set html on email', function(done) {

        transporter.sendMail(mail, function(err, info) {
            if (err) return done(err);

            var body = info.response.toString();
            body.should.contain('<h1>This is a test</h1>');
            body.should.contain('Name');
            done();
        });

    });

    it('should not overwrite existing html entry', function(done) {

        var html = mail.html = '<h1>hardcoded</h1>';
        transporter.sendMail(mail, function(err, info) {
            if (err) return done(err);

            var body = info.response.toString();
            body.should.contain(html);
            done();
        });

    });
});


describe('when options passed', function() {

    var sut,
        mail,
        transporter;

    beforeEach(function() {
        transporter = nodemailer.createTransport(transport());
        sut = nodemailerExpressHandlebars({
            viewEngine: {},
            viewPath: path.resolve(__dirname, '../views')
        });
        transporter.use('compile', sut);
        mail = {
            from: 'from@domain.com',
            to: 'to@domain.com',
            subject: 'Test',
            template: 'email',
            context: {
                name: 'Name'
            }
        };
    });

    it('should set html on email', function(done) {

        transporter.sendMail(mail, function(err, info) {
            if (err) return done(err);

            var body = info.response.toString();
            body.should.contain('<h1>This is a test</h1>');
            body.should.contain('Name');
            done();
        });

    });
});