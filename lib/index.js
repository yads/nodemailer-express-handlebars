const TemplateGenerator = require('./generator');

module.exports = function (options) {
  const generator = new TemplateGenerator(options);

  return async (mail, cb) => {
    try {
      await generator.render(mail);
    } catch (err) {
      return cb(err);
    }

    cb();
  };
};

