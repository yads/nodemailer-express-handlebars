'use strict';

var path = require('path'),
    handlebars = require('express-handlebars');

module.exports = function(options) {
    var generator = new TemplateGenerator(options);

    return function(mail, cb) {
        generator.render(mail, cb);
    };
};

var TemplateGenerator = function(opts) {
    var viewEngine = opts.viewEngine || {};
    if (!viewEngine.renderView) {
        viewEngine = handlebars.create(viewEngine);
    }
    this.viewEngine = viewEngine;
    this.viewPath = opts.viewPath;
};

TemplateGenerator.prototype.render = function render(mail, cb) {
    if (mail.data.html) return cb();

    var templatePath = path.join(this.viewPath, mail.data.template + '.handlebars');

    this.viewEngine.renderView(templatePath, mail.data.values, function(err, body) {
        if (err) return cb(err);

        mail.data.html = body;
        cb();
    });
};