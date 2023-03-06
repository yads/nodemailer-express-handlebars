'use strict';

const { expect } = require('chai');
const nodemailerExpressHandlebars = require('../..'),
  nodemailer = require('nodemailer'),
  handlebars = require('express-handlebars'),
  path = require('path');

describe('when view engine passed', function () {
  let sut, mail, transporter, viewEngine;

  beforeEach(function () {
    transporter = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
    });
    viewEngine = handlebars.create({
      partialsDir: path.resolve(__dirname, '../views/partials/'),
      defaultLayout: false,
    });
    sut = nodemailerExpressHandlebars({
      viewEngine: viewEngine,
      viewPath: path.resolve(__dirname, '../views'),
    });
    transporter.use('compile', sut);
    mail = {
      from: 'from@domain.com',
      to: 'to@domain.com',
      subject: 'Test',
      template: 'email',
      context: {
        name: 'Name',
      },
    };
  });

  it('should handle errors', function (done) {
    viewEngine.renderView = () => {
      throw 'Rendering Error';
    };

    transporter.sendMail(mail, (err, info) => {
      expect(err).to.eq('Rendering Error');
      done();
    });
  });

  it('should set html on email', function (done) {
    transporter.sendMail(mail, (err, info) => {
      if (err) return done(err);

      const body = info.message.toString();
      expect(body).to.contain('<h1>This is a test</h1>');
      expect(body).to.contain('Name');
      done();
    });
  });

  it('should not overwrite existing html entry', function (done) {
    const html = (mail.html = '<h1>hardcoded</h1>');
    transporter.sendMail(mail, (err, info) => {
      if (err) return done(err);

      const body = info.message.toString();
      expect(body).to.contain(html);
      done();
    });
  });

  it('should handle text_template', function (done) {
    mail.text_template = 'text';
    transporter.sendMail(mail, (err, info) => {
      if (err) return done(err);

      const body = info.message.toString();
      expect(body).to.contain('<h1>This is a test</h1>');
      expect(body).to.contain('Name');
      expect(body).to.contain('Text email');

      done();
    });
  });

  it('should handle view and partials', function (done) {
    mail.template = 'with_partial';
    transporter.sendMail(mail, (err, info) => {
      if (err) return done(err);

      const body = info.message.toString();
      expect(body).to.contain('<h1>Header</h1>');
      expect(body).to.contain('Email content');
      done();
    });
  });
});

describe('when options passed', function () {
  var sut, mail, transporter;

  beforeEach(function () {
    transporter = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
    });
    sut = nodemailerExpressHandlebars({
      viewEngine: {
        partialsDir: path.resolve(__dirname, '../views/partials/'),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, '../views'),
    });
    transporter.use('compile', sut);
    mail = {
      from: 'from@domain.com',
      to: 'to@domain.com',
      subject: 'Test',
      template: 'email',
      context: {
        name: 'Name',
      },
    };
  });

  it('should set html on email', function (done) {
    transporter.sendMail(mail, (err, info) => {
      if (err) return done(err);

      const body = info.message.toString();
      expect(body).to.contain('<h1>This is a test</h1>');
      expect(body).to.contain('Name');
      done();
    });
  });
});
