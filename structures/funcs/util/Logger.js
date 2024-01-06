const chalk = require('chalk');
const dateFormat = require('dateformat');
const util = require('util');

class Logger {
    static get prefix() {
        return chalk.gray(dateFormat(Date.now(), 'dd/mm/yy HH:MM:ss'));
    }

    static get logPrefix() {
        return `[${dateFormat(Date.now(), 'isoUtcDateTime')}]`;
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
        console.log(this.logPrefix + ' ' + args.join(' '));
    }

}

module.exports = Logger;