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
    var textTemplatePath='';
    if (!!mail.data.text_template) {
        textTemplatePath=path.join(this.viewPath, mail.data.text_template + this.extName);
    }
    var viewEngine=this.viewEngine;
    this.viewEngine.renderView(templatePath, mail.data.context, function(err, body) {
        if (err) return cb(err);
        mail.data.html = body;
        if(!mail.data.text_template)cb();
        else{
            viewEngine.renderView(textTemplatePath, mail.data.context, function(err, body) {
                if (err) return cb(err);
                mail.data.text = body;
                cb();
            });
       }
    });
};

module.exports = TemplateGenerator;
