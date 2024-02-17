const chalk = require('chalk');
const dat = require('date-and-time');
const util = require('util');

const config = require('../../config.json');
const isDebug = config.enableDebugLogs;

class Logger {
    static get prefix() {
        return chalk.gray(dat.format(new Date(), 'DD/MM/YYYY HH:mm:ss'));
    }

    static get logPrefix() {
        return `[${dat.format(new Date(), 'DD/MM/YYYY HH:mm:ss')}]`;
    }

    static formatInput(args) {
        return args.map((arg) => arg instanceof Object ? util.inspect(arg) : arg);
    }

    //////////////////////////

    static error(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.red('x') + '  ' + args.join(' '));
    }

    static warn(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.yellow('⚠') + '  ' + args.join(' '));
    }

    static info(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.cyan('ℹ') + '  ' + args.join(' '));
    }

    static success(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.green('✓') + '  ' + args.join(' '));
    }

    static module(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.magenta('[MODULE]') + ' ' + args.join(' '));
    }

    static log(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + args.join(' '));
    }

    static debug(...args) {
        args = this.formatInput(args)
        if (isDebug) console.log(this.prefix + ' ' + chalk.blue('[DEBUG]') + '  ' + args.join(' '));
    }

}

module.exports = Logger;
