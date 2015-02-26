var fs = require("fs");
var order = fs.readFileSync("test-order.txt").toString();
//var order = '******* Email completed template to HOSTMASTER@ASCIO.COM *******';
var SMTPConnection = require('smtp-connection');

var options = {
  port : 2525,
  host: "localhost", 
}

var connection = new SMTPConnection(options);
connection.connect(function() {
    console.log("connnected to server");
    var envelope = {
      from : "ml@webrender.de",
      to   : "ascio@localhost"
    }
    connection.send(envelope, order, function(err,info) {
      console.log("message sent!",err,info);
      connection.quit();
    });
})


/*
describe('#unescape', function() {
  it('converts &amp; into &', function() {
    unescape('&amp;').should.equal('&');
  });
});
*/
