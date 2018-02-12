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
    
        mail.data.subject = require('html-entities').AllHtmlEntities.decode(handlebars.compile(mail.data.subject)(mail.data.context))
        mail.data.html = body;
        return cb();
    });
};

module.exports = TemplateGenerator;
