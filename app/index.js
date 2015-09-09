var _ = require('lodash-node');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    'use strict';
    this.pkg = require('../package.json');
  },

  prompting: function() {
    'use strict';
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      chalk.green('\\[._.]/\n') +
      'Welcome to the ' + chalk.yellow(this.pkg.name.replace('generator-', '')) + ' generator! ' +
      'This will add Docker scaffolding to your project folder'
    ));

    var dir = this.destinationPath();
    var dirParts = dir.split('/');
    var prompts = [
      {
        type: 'input',
        name: 'appname',
        message: 'What is the name of your app?',
        default: dirParts[dirParts.length - 1]
      }, {
        type: 'input',
        name: 'org',
        message: 'What is the user/org for this app?',
        default: dirParts[dirParts.length - 2]
      }, {
        type: 'input',
        name: 'dockerHub',
        message: 'What docker hub do you want to use?',
        default: 'hub.docker.com:5000'
      }, {
        type: 'input',
        name: 'port',
        message: 'What port does your app listen on?',
        default: 3000
      }, {
        type: 'input',
        name: 'fromOS',
        message: 'What base OS does your app build with?',
        default: 'centos:7'
      }
    ];

    this.prompt(prompts, function(props) {
      this.appname = props.appname;
      this.org = props.org;
      this.externalPort = parseInt(_.random(3, 9) + '' + _.random(0, 9) + '' + _.random(0, 9) + '' + _.random(0, 9), 10);
      this.internalPort = parseInt(props.port, 10);
      this.dockerHub = props.dockerHub;
      this.fromOS = props.fromOS;
      done();
    }.bind(this));
  },

  writing: {
    provision: function() {
      'use strict';
      this.fs.makedir('app');
      this.fs.makedir('lib');

      this.fs.copy(
        this.templatePath('templates/.dockerignore'),
        this.destinationPath('.dockerignore')
      );
      this.fs.copy(
        this.templatePath('templates/.env'),
        this.destinationPath('.env'),
        {
          internalPort: this.internalPort
        }
      );
      this.fs.copy(
        this.templatePath('templates/dev'),
        this.destinationPath('dev')
      );
      this.fs.copyTpl(
        this.templatePath('templates/dev.config.sh'),
        this.destinationPath('dev.config.sh'),
        {
          appname: this.appname,
          org: this.org,
          externalPort: this.externalPort,
          dockerHub: this.dockerHub
        }
      );
      this.fs.copyTpl(
        this.templatePath('templates/docker-compose.tmpl'),
        this.destinationPath('docker-compose.tmpl'),
        {
          externalPort: this.externalPort,
          internalPort: this.internalPort
        }
      );
      this.fs.copy(
        this.templatePath('templates/docker.sh'),
        this.destinationPath('lib/docker.sh')
      );
      this.fs.copyTpl(
        this.templatePath('templates/Dockerfile'),
        this.destinationPath('Dockerfile'),
        {
          internalPort: this.internalPort,
          fromOS: this.fromOS
        }
      );
      this.fs.copy(
        this.templatePath('templates/libecho.sh'),
        this.destinationPath('lib/libecho.sh')
      );
      this.fs.copy(
        this.templatePath('templates/libinstall.sh'),
        this.destinationPath('lib/libinstall.sh')
      );
      this.fs.copy(
        this.templatePath('templates/.rsyncignore'),
        this.destinationPath('app/.rsyncignore')
      );
      this.fs.copy(
        this.templatePath('templates/exec'),
        this.destinationPath('app/exec')
      );

    }
  },
  end: function() {
    'use strict';
    this.log(
      '\n\n' +
      chalk.green('\\[._.]/\n') +
      'All done!\n' +
      'Go ahead and run\n' +
      chalk.cyan('./dev init') + '\n' +
      'to bootstrap your docker environment!'
    );
  }
});
