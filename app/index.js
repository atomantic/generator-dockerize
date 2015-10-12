var _ = require('lodash-node');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    'use strict';
    this.pkg = require('../package.json');
  },
  userData: {},
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
        name: 'appBootTime',
        message: 'How many seconds does your app take to start?',
        default: 5
      }, {
        type: 'input',
        name: 'vmCreateTime',
        message: 'About how many seconds does your docker image take to build (you can edit this later in dev.config.sh)?',
        default: 10
      }, {
        type: 'input',
        name: 'fromOS',
        message: 'What base OS does your app build with?',
        default: 'centos:7'
      }, {
        type: 'confirm',
        name: 'sampleApp',
        message: 'install sample index.html app?',
        default: true
      }
    ];

    this.prompt(prompts, function(props) {
      this.userData = {
        appname: props.appname,
        org: props.org,
        externalPort: parseInt(_.random(3, 9) + '' + _.random(0, 9) + '' + _.random(0, 9) + '' + _.random(0, 9), 10),
        internalPort: parseInt(props.port, 10),
        dockerHub: props.dockerHub,
        fromOS: props.fromOS,
        appBootTime: props.appBootTime,
        vmCreateTime: props.vmCreateTime,
        sampleApp: props.sampleApp
      };

      done();
    }.bind(this));
  },

  writing: {
    provision: function() {
      'use strict';
      mkdirp('app');

      this.fs.copy(
        this.templatePath('.dockerignore'),
        this.destinationPath('.dockerignore')
      );
      this.fs.copyTpl(
        this.templatePath('.env'),
        this.destinationPath('.env'),
        this.userData
      );
      this.fs.copy(
        this.templatePath('dev'),
        this.destinationPath('dev')
      );
      this.fs.copyTpl(
        this.templatePath('dev.config.sh'),
        this.destinationPath('dev.config.sh'),
        this.userData
      );
      this.fs.copyTpl(
        this.templatePath('docker-compose.tmpl'),
        this.destinationPath('docker-compose.tmpl'),
        this.userData
      );
      this.fs.copyTpl(
        this.templatePath('Dockerfile'),
        this.destinationPath('Dockerfile'),
        this.userData
      );
      this.fs.copy(
        this.templatePath('app/.rsyncignore'),
        this.destinationPath('app/.rsyncignore')
      );
      this.fs.copy(
        this.templatePath('app/exec'),
        this.destinationPath('app/exec')
      );
      if (this.userData.sampleApp) {
        this.fs.copy(
          this.templatePath('app/index.html'),
          this.destinationPath('app/index.html')
        );
      }

    }
  },
  end: function() {
    'use strict';
    this.log(
      '\n\n' +
      chalk.green('\\[._.]/\n') +
      'All done!\n' +
      'Edit the Dockerfile, app/exec and docker-compose.tml as needed!\n' +
      'Then run\n' +
      chalk.cyan('./dev init') + '\n' +
      'to bootstrap your docker environment!'
    );
  }
});
