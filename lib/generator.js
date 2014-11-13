'use strict';

var path = require('path'),
    handlebars = require('express-handlebars');

var TemplateGenerator = function(opts) {
    var viewEngine = opts.viewEngine || {};
    if (!viewEngine.renderView) {
        viewEngine = handlebars.create(viewEngine);
    }
    this.viewEngine = viewEngine;
    this.viewPath = opts.viewPath;
    this.extName = opts.extName || '.handlebars';
};

TemplateGenerator.prototype.render = function render(mail, cb) {
    if (mail.data.html) return cb();

    var templatePath = path.join(this.viewPath, mail.data.template + this.extName);

    this.viewEngine.renderView(templatePath, mail.data.context, function(err, body) {
        if (err) return cb(err);

        mail.data.html = body;
        cb();
    });
};

module.exports = TemplateGenerator;