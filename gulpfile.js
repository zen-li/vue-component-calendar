'use strict';

/**
 * 脚手架工具常用API文档：
 *
 * @@新建分支：
 * 运行命令：`gulp newbranch`
 * 包含的过程有：
 * 1.拉取本地和远程所有tag分支，取最大版本号来自增1
 *
 * @@预发布：
 * 运行命令：`gulp prepub -m 'message'`，
 * 包含的过程有：
 * 1.提交git变更，push到相应分支，打一个远程tag触发stash的hook脚本，在git端进行文件发布。
 * 2.遍历src目录下的html文件，进行本地发布
 *
 * @@发布：
 * 1.运行命令`gulp publish`，
 * 包含的过程有：
 * 1.推送一个publish的分支到远程，触发hook脚本进行发布。注意：publish每个分支只能发布一次，因为发布之后CDN始终有缓存，不会生效。
 * 2.遍历build目录下的html文件，进行本地发布
 *
 * @@其它：见wiki：http://wiki.sankuai.com/pages/viewpage.action?pageId=345038518
 */

var gulp          = require('gulp');
var path          = require('path');
var generatorUtil = require('generator-hfe-utils');
// var generatorUtil = require('/usr/local/lib/node_modules/generator-hfe-utils');
generatorUtil.gulpTaskList.forEach(function (taskfile) {
    var suffix = taskfile.split('.').pop();
    if (suffix === 'js') { //过滤其它文件
        require(generatorUtil.gulpPath + taskfile)(gulp, generatorUtil.gulpLoadPlugins, generatorUtil.gulpConfig);
    }
});

var gulpTaskList = require('fs').readdirSync(path.join('./gulp/'));
gulpTaskList.forEach(function (taskfile) {
    var suffix = taskfile.split('.').pop();
    if (suffix === 'js') { //过滤其它文件
        require('./gulp/' + taskfile)(gulp);
    }
});
