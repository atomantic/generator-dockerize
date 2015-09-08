var _ = require('lodash-node');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
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
        name: 'docker_hub',
        message: 'What docker hub do you want to use?',
        default: 'hub.docker.com:5000'
      }, {
        type: 'input',
        name: 'port',
        message: 'What port does your app listen on?',
        default: 3000
      }, {
        type: 'input',
        name: 'from_os',
        message: 'What base OS does your app build with?',
        default: 'centos:7'
      }
    ];

    this.prompt(prompts, function(props) {
      this.appname = props.appname;
      this.org = props.org;
      this.external_port = parseInt(_.random(3, 9) + '' + _.random(0, 9) + '' + _.random(0, 9) + '' + _.random(0, 9), 10);
      this.internal_port = parseInt(props.port, 10);
      this.docker_hub = props.docker_hub;
      this.from_os = props.from_os;
      done();
    }.bind(this));
  },

  writing: {
    provision: function() {
      this.fs.copy(
        this.templatePath('templates/.dockerignore'),
        this.destinationPath('.dockerignore')
      );
      this.fs.copy(
        this.templatePath('templates/.env'),
        this.destinationPath('.env'),
        {
          internal_port: this.internal_port
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
          external_port: this.external_port,
          docker_hub: this.docker_hub
        }
      );
      this.fs.copyTpl(
        this.templatePath('templates/docker-compose.tmpl'),
        this.destinationPath('docker-compose.tmpl'),
        {
          external_port: this.external_port,
          internal_port: this.internal_port
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
          internal_port: this.internal_port,
          from_os: this.from_os
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

    }
  },
  end: function() {

    this.log(
      '\n\n'
      chalk.green('\\[._.]/\n') +
      'All done!\n' +
      'Go ahead and run\n' +
      chalk.cyan('./dev init') + '\n' +
      'to bootstrap your docker environment!'
    );
  }
});
