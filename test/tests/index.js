import { expect } from 'chai';
import nodemailerExpressHandlebars from '../../index.js';
import nodemailer from 'nodemailer';
import handlebars from 'express-handlebars';
import { resolve } from 'path';

describe('when view engine passed', function () {
  let sut, mail, transporter, viewEngine;

  beforeEach(function () {
    transporter = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
    });
    viewEngine = handlebars.create({
      partialsDir: resolve(import.meta.dirname, '../views/partials/'),
      defaultLayout: false,
    });
    sut = nodemailerExpressHandlebars({
      viewEngine: viewEngine,
      viewPath: resolve(import.meta.dirname, '../views'),
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

  it('should handle errors', async function () {
    viewEngine.renderView = () => {
      throw 'Rendering Error';
    };

    let info;
    try {
      info = await transporter.sendMail(mail);
    } catch (err) {
      expect(err).to.eq('Rendering Error');
    }
    expect(info).to.be.undefined;
  });

  it('should set html on email', async function () {
    const info = await transporter.sendMail(mail);

    const body = info.message.toString();
    expect(body).to.contain('<h1>This is a test</h1>');
    expect(body).to.contain('Name');
  });

  it('should not overwrite existing html entry', async function () {
    const html = (mail.html = '<h1>hardcoded</h1>');

    const info = await transporter.sendMail(mail);

    const body = info.message.toString();
    expect(body).to.contain(html);
  });

  it('should handle text_template', async function () {
    mail.text_template = 'text';

    const info = await transporter.sendMail(mail);

    const body = info.message.toString();
    expect(body).to.contain('<h1>This is a test</h1>');
    expect(body).to.contain('Name');
    expect(body).to.contain('Text email');
  });

  it('should handle view and partials', async function () {
    mail.template = 'with_partial';

    const info = await transporter.sendMail(mail);

    const body = info.message.toString();
    expect(body).to.contain('<h1>Header</h1>');
    expect(body).to.contain('Email content');
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
        partialsDir: resolve(import.meta.dirname, '../views/partials/'),
        defaultLayout: false,
      },
      viewPath: resolve(import.meta.dirname, '../views'),
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

  it('should set html on email', async function () {
    const info = await transporter.sendMail(mail);

    const body = info.message.toString();
    expect(body).to.contain('<h1>This is a test</h1>');
    expect(body).to.contain('Name');
  });
});
