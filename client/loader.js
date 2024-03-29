var _ = require("underscore");
var p = require("path");
var express = require("express");
var bluebird = require("bluebird");
var speedyStatic = require("speedy-static");

module.exports = function(app, config){
	
	return new bluebird.Promise(function(res, rej){
		
		app.set("packageRootUrl", config.packageRootUrl);
		
		if(config.mainPackage){
			
			app.get("/", require(p.resolve(__dirname, "./services/preparedIndex.js"))(config.mainPackage));
			
		}
		
		app.get("/:main", require(p.resolve(__dirname, "./services/index.js")));
		
		new bluebird.Promise(function(res, rej){
			
			res(speedyStatic(p.resolve(__dirname, "./statics"), _.extend(_.clone(config), {"max-cache-size":5242880})));
			
		}).then(function(middleware){
			
			app.use("/statics", middleware);
			res(app);
			
		});
		
	});
	
};