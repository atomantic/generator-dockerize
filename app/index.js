var _ = require('lodash');
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
        name: 'apploc',
        message: 'What directory relative to this project is your app stored in?',
        default: 'app'
      }, {
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
        message: 'About how many seconds does your docker image take to build (you can edit this later in dev.config)?',
        default: 10
      }, {
        type: 'input',
        name: 'fromOS',
        message: 'What base OS does your app build with?',
        default: 'centos:7'
      }, {
        type: 'confirm',
        name: 'init',
        message: 'Does your app require custom initialization beyond docker (sub-module update/build, npm install, etc) that you want to manage in a custom init script?',
        default: false
      }, {
        type: 'confirm',
        name: 'sampleApp',
        message: 'install sample index.html app?',
        default: false
      }
    ];

    this.prompt(prompts, function(props) {
      this.userData = {
        apploc: props.apploc,
        appname: props.appname,
        init: props.init,
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
      mkdirp(this.userData.apploc);

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
        this.templatePath('dev.config'),
        this.destinationPath('dev.config'),
        this.userData
      );
      if(this.userData.init){
        this.fs.copyTpl(
          this.templatePath('dev.init.sh'),
          this.destinationPath('dev.init.sh'),
          this.userData
        );
      }
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
      this.fs.copyTpl(
        this.templatePath('test.sh'),
        this.destinationPath('test.sh'),
        this.userData
      );
      this.fs.copy(
        this.templatePath('app/.rsyncignore'),
        this.destinationPath(this.userData.apploc.substr(1) + '/.rsyncignore')
      );
      this.fs.copy(
        this.templatePath('app/exec'),
        this.destinationPath(this.userData.apploc.substr(1) + '/exec')
      );
      if (this.userData.sampleApp) {
        this.fs.copy(
          this.templatePath('app/index.html'),
          this.destinationPath(this.userData.apploc.substr(1) + '/index.html')
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
      'Edit the Dockerfile, ' + this.userData.apploc + '/exec and docker-compose.tml as needed!\n' +
      'Then run\n' +
      chalk.cyan('./dev init') + '\n' +
      'to bootstrap your docker environment!'
    );
  }
});
