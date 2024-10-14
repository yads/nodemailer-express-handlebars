import { join } from 'path';
import handlebars from 'express-handlebars';
import { existsSync } from 'fs';

class TemplateGenerator {
  constructor(opts) {
    let viewEngine = opts.viewEngine || {};
    if (!viewEngine.renderView) {
      viewEngine = handlebars.create(viewEngine);
    }
    this.viewEngine = viewEngine;
    this.viewPath = opts.viewPath;
    this.extName = opts.extName || '.handlebars';
  }

  async render(mail) {
    if (mail.data.html) {
      return;
    }

    let templatePath = '';
    if (Array.isArray(this.viewPath)) {
      for(var index in this.viewPath) {
        var tempPath = join(this.viewPath[index], mail.data.template + this.extName);    
        if (existsSync(tempPath)) {
          templatePath = tempPath
          break;
        }
      }
      if (templatePath==='') {
        var notFound = new Error("ENOENT: no such file or directory, open '"+this.viewPath.join("','")+"'");
        notFound.code ="ENOENT"
        notFound.errno = -4058
        notFound.path = this.viewPath
        notFound.syscall = 'open'
        throw notFound;
      }
    } else {
        templatePath = path.join(
          this.viewPath,
          mail.data.template + this.extName
        );
    }

    let textTemplatePath = '';
    if (mail.data.text_template) {
      if (Array.isArray(this.viewPath)) {
        for(var index in this.viewPath) {
          var tempPath = join(this.viewPath[index], mail.data.template + this.extName);    
          if (existsSync(tempPath)) {
            textTemplatePath = tempPath
            break;
          }
        }
        if (textTemplatePath==='') {
          var notFound = new Error("ENOENT: no such file or directory, open '"+this.viewPath.join("','")+"'");
          notFound.code ="ENOENT"
          notFound.errno = -4058
          notFound.path = this.viewPath
          notFound.syscall = 'open'
          throw notFound;  
        }
      } else {
          textTemplatePath = path.join(
            this.viewPath,
            mail.data.template + this.extName
          );
      }
    }

    mail.data.html = await this.viewEngine.renderView(
      templatePath,
      mail.data.context,
    );
    if (mail.data.text_template) {
      mail.data.text = await this.viewEngine.renderView(
        textTemplatePath,
        mail.data.context,
      );
    }
  }
}

export default TemplateGenerator;
