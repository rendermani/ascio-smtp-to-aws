var console = require("console");
var path = require("path");
var appRoot  = path.resolve(__dirname);


var aws = require(appRoot+"/../../../ascio-smtp-to-aws");

exports.register = function() {
	this.register_hook('queue','aws')
	this.register_hook('queue_outbound','aws');
}

exports.aws = function (next, connection) {
	var plugin=this;
	var config = this.config.get('aws.ini');
	var message = connection.transaction.message_stream._queue.toString();
	try {
		var order = aws.parseMessage(message);		
	} catch (e) {
		connection.logerror(plugin,e.toString());
		return next(DENY, e.toString());
	}
	var async = config.smtp.asynchronous == true;
	if(async) next(OK,"Order sent to Ascio.");	
	aws.send(order, config.main, function(err,result) {				
		if(err) {
			connection.logerror(plugin,err.Message);
			if(!async) next(DENYDISCONNECT,"Send to AWS failed: "+err.Message);
			return;
		} else
		if(result.ResultCode == 200) {
			connection.loginfo(plugin,"Order sent to Ascio: ",result.order.OrderId);
			if(!async) next(OK,"Order sent to Ascio.");
			return;
		} else {
			if(!async) next(DENY,result.Message + ".\n "+result.MessageLong+"\n")
		}
	});		
}
exports.aws_outbound = exports.aws;
