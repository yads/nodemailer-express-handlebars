# Express Handlebars plugin for Nodemailer
This plugin works with nodemailer 6.x. And uses the [express-handlebars](https://github.com/express-handlebars/express-handlebars) view
engine to generate html emails.

# Install from npm
```bash
npm install nodemailer-express-handlebars
```
# Usage

    
   const nodemailer = require("nodemailer");
   
   
   const hbs = require("nodemailer-express-handlebars");
   
  
   const path = require("path");
   

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email",
        pass: "your_password",
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "templateViews"),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, "templateViews"),
      extName: ".handlebars",
    };

    transporter.use(
      "compile",
      hbs(handlebarOptions),
    );

    var mailOptions = {
      from: "your_email",
      to: "to_email",
      subject: "your_subject",
      template: "main",
      context: {
        var: var_value
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    
## Plugin Options
The plugin expects the following options:
* __viewEngine (required)__ either the express-handlebars view engine instance or [options for the view engine](https://github.com/express-handlebars/express-handlebars#configuration-and-defaults)
* __viewPath (required)__ provides the path to the directory where your views are
* __extName__ the extension of the views to use (defaults to `.handlebars`)

## Mail options
Set the template and values properties on the mail object before calling `sendMail`
* __template__ the name of the template file to use
* __context__ this will be passed to the view engine as the context as well as view engine options see [here](https://github.com/express-handlebars/express-handlebars#renderviewviewpath-optionscallback-callback)

# License
MIT
