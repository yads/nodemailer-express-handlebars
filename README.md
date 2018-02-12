# Express Handlebars plugin for Nodemailer
This plugin works with nodemailer 4.x. And uses the [express-handlebars](https://github.com/ericf/express-handlebars) view
engine to generate html emails.

# Install from npm
```bash
npm install nodemailer-express-handlebars
```
# Usage
```javascript
//reference the plugin
var hbs = require('nodemailer-express-handlebars');
//attach the plugin to the nodemailer transporter
transporter.use('compile', hbs(options));
//send mail with options
var mail = {
   from: 'from@domain.com',
   to: 'to@domain.com',
   subject: 'Test',
   template: 'email',
   context: {
       name: 'Name'
   }
}
transporter.sendMail(mail);
```
## Plugin Options
The plugin expects the following options:
* __viewEngine (required)__ either the express-handlebars view engine instance or [options for the view engine](https://github.com/ericf/express-handlebars#configuration-and-defaults)
* __viewPath (required)__ provides the path to the directory where your views are
* __extName__ the extension of the views to use (defaults to `.handlebars`)

## Mail options
Set the template and values properties on the mail object before calling `sendMail`
* __template__ the name of the template file to use
* __context__ this will be passed to the view engine as the context as well as view engine options see [here](https://github.com/ericf/express-handlebars#renderviewviewpath-optionscallback-callback)

# License
MIT
