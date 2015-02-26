var soap = require("soap");
var path = require("path");

module.exports.appRoot  = path.resolve(__dirname);

var wsdlTest = module.exports.appRoot+'/AscioServiceTest.wsdl';
var wsdl     = module.exports.appRoot+'/AscioService.wsdl';

var paramMapping = require("./parameter-map.js").orderParams;
var typeMapping  = require("./parameter-map.js").orderTypes;

function createStructure(value,path,structure) {
	var node;
	var pathArray = path.split("/")
	if(pathArray.length > 1) {
		if(!structure[pathArray[0]]) structure[pathArray[0]]={}
		createStructure(value,pathArray.splice(1).join("/"),structure[pathArray[0]])
	} else {
		structure[path] = value; 
	}
}
var cleanParameters = function(obj) {
	var out = {};
	Object.keys(obj).forEach(function(key) {
		if(key=="attributes" || key=="Status" || key=="CreDate") return;
		if(obj[key] instanceof Array) {
			out[key] = obj[key];
		} else if(obj[key] instanceof Object) {
			var sub = cleanParameters(obj[key]);
			if(Object.keys(sub)[0]) out[key] = sub;
		}
		else if(obj[key] != null) {
			out[key] = obj[key];
		}
	})
	return out;
}
module.exports.parseMessage = function (message) {
	var out = aws.orderTemplate;	
	message.split("\n").forEach(function(line) {
		var res = line.match(/([0-9]+[a-z]+).*:(.*)/)	
		if (res && res[2].trim() != "") {
			var field = {
				key : res[1],
				value : res[2].trim(),
			}
			if(paramMapping[field.key]) {				
				if(field.key=="1a") {
					if(!typeMapping[field.value]) throw new Error("OrderType "+field.value+ " does not exists")
					field.value = typeMapping[field.value].aws;
				}
				createStructure(field.value,paramMapping[field.key].aws,out)				
			}
		};
	})
	return cleanParameters(out);
}
module.exports.send = function(order,config,callback) {
	var url = config.mode == "test" ? wsdlTest : wsdl; 
	soap.createClient(url, function(err, client) {
		client.LogIn({
			session : {
				Account : config.account,
				Password: config.password
			}
		}, function(err,result) {
			if(err || result.LogInResult.ResultCode=="401") {		
				callback(result.LogInResult,null);
				return;
			}			
			client.CreateOrder({
				sessionId : result.sessionId,
				order 	  : order
			},function(err,result) {
				if(err) {
					err = err.body;
					callback(err,result)
					return false;
				} 
				if(result.CreateOrderResult.ResultCode != 200) {
					if(result.CreateOrderResult.Values.string instanceof Array) {
						result.CreateOrderResult.MessageLong = result.CreateOrderResult.Values.string.join(" \n");
					} else {
						result.CreateOrderResult.MessageLong = result.CreateOrderResult.Values.string
					}
				} else result.CreateOrderResult.MessageLong = "";
				callback(err,result.CreateOrderResult);				
			})
			
		})
	});	
}