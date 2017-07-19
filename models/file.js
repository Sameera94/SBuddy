'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new mongoose.Schema({
	originaFileName	: String,
	originalFileLocation: String,
	projectName			: String,
    versions: [{
		vName   : String,
        version : Number,
        path    : String
    }],
    created: { type: Date, default: Date.now }
});

var File = module.exports = mongoose.model('File',FileSchema);


module.exports.addNewFile = function(newFile, callback){
    newFile.save(callback);
}

module.exports.addNewVersion = function(file, vName, version, path, callback){
    File.findByIdAndUpdate(
        file,
        { 
            $push: {
                "versions": {
                    "vName"  : vName,
                    "version": version,
                    "path"   : path            
                }
            }
        },
        {
            safe: true, 
            upsert: true, 
            new : true
        },
        callback
    );
}

module.exports.getAllFiles = function(callback){
	File.find({},callback);
}