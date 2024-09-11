import TemplateGenerator from './generator.js';

export default function (options) {
  const generator = new TemplateGenerator(options);

  return async (mail, cb) => {
    try {
      await generator.render(mail);
    } catch (err) {
      return cb(err);
    }

    cb();
  };
}
