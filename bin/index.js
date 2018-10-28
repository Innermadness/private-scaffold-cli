#!/usr/bin/env node
// ↑ 这句话告诉系统，使用node.js来运行本脚本（env表示会从环境变量中查找node的位置）。

// npm link
// 可以将任意位置的npm包链接到全局环境，在任意位置使用命令行都能直接运行该npm包。

const fs = require('fs');
// commaner.js 一个nodejs的轻量级命令行框架
const program = require('commander');
// 一个通用交互式命令行UI的集合
const inquirer = require('inquirer');
// 功能如其名 ↓
const downloadGitRepo = require('download-git-repo');
// 给终端字符串上色~
const chalk = require('chalk');
// 获取package.json拿一下版本号
const package = require('../package.json');

const cwd = process.cwd();

program
  .version(package.version)
  .description(package.description);

program
  .command('create')
  .action(() => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Please enter your project\'s name:',
          validate(input) {
            const done = this.async();
            setTimeout(() => {
              if (!input || typeof input !== 'string') {
                done(chalk.redBright('You need to provide a project name.'));
                return;
              }
              const dir = `${cwd}\\${input}`;
              if (fs.existsSync(dir)) {
                done(chalk.redBright(`'${input}' already exists in the current directory, Please use a different name.`));
                return;
              }
              done(null, true);
            }, 0);
          }
        }
      ]).then(res => {
        const { name } = res;
        console.log(chalk.cyanBright('Downloading template...'));
        downloadGitRepo(
          'Innermadness/private-scaffold',
          `${cwd}\\${name}`,
          false,
          err => {
            if (err) {
              console.log(chalk.redBright('Something went wrong during downloading, please retry.'));
            } else {
              console.log(chalk.greenBright('Success~'));
              console.log('');
              console.log(`  Now you can:`);
              console.log(chalk.cyanBright(`    $ cd ${name}`));
              console.log(chalk.cyanBright(`    $ npm install`));
              console.log(chalk.cyanBright(`    $ npm start`));
              console.log('');
            }
          }
        );
      });
  });

program.parse(process.argv);
