var fs = require("fs");
var a = require("ascio-smtp-to-aws");
var mail = fs.readFileSync("./test-order.txt").toString();
var order = a.parseMessage(mail);
console.log("order",order);
a.sendAws(order,function(err,result) {
	console.log(err,result);
});
