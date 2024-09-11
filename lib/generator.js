import { join } from 'path';
import handlebars from 'express-handlebars';

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

    let templatePath = join(this.viewPath, mail.data.template + this.extName);
    let textTemplatePath = '';
    if (mail.data.text_template) {
      textTemplatePath = join(
        this.viewPath,
        mail.data.text_template + this.extName,
      );
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
