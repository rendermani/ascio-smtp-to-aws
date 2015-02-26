var paramMapping = require("./parameter-map.js").orderParams;
var typeMapping  = require("./parameter-map.js").orderTypes;
var url = 'AscioServiceTest.wsdl';
var soap = require("soap");
var ascio = require('ascio');


var awsStructure = {
	Domain : {
		Registrant : {},
		AdminContact : {},
		TechContact : {},
		BillingContact : {},
		Trademark : {},
		Nameservers : {
			Nameserver : []
		}
	}
}
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
module.exports.parseMessage = function (message) {
	var out = {}
	message.split("\n").forEach(function(line) {
		var res = line.match(/([0-9]+[a-z]+).*:(.*)/)	
		if (res && res[2].trim() != "") {
			var field = {
				key : res[1],
				value : res[2].trim(),
			}
			if(paramMapping[field.key]) {				
				if(field.key=="1a") {
					console.log("type",field.value);
					console.log(typeMapping);
					field.value = typeMapping[field.value].aws;
				}
				createStructure(field.value,paramMapping[field.key].aws,out)				
			}
		};
	})
	return out;
}



module.exports.sendAws = function(order) {
	soap.createClient(url, function(err, client) {
	  if(err) console.log("err",err);
	  else {
		client.LogIn({
			session : {
				Account : "cvkd148",
				Password: "55smurf"
			}
		}, function(err,result) {
			client.CreateOrder({
				sessionId : result.sessionId,
				order 	  : order
			},function(err,result) {
				console.log(err,result);
				console.log(result.CreateOrderResult);
			})
			
		})
	  };
	});	
};