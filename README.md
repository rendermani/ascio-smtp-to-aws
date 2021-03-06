# ascio-smtp-to-aws
SMTP Server plugin for Haraka (NodeJS). Mail-Gateway that receives mail from Haraka and forwards it to the Ascio Web Service via SOAP.

Installation:
--------------

1. Download and install Haraka: https://github.com/baudehlo/Haraka
2. Download and install ascio-smtp-to-aws: git clone https://github.com/rendermani/ascio-smtp-to-aws.git

Configuration:
---------------

* Edit config/aws.ini to add your credentials
* Edit config/smtp.ini for SMTP-Settings like IP and Port
* Edit config/host_list for allowed hosts

The setting "asynchronous = false" in the aws.ini means:

* AWS errormessages are sent as SMTP-response
* The SMTP response is after the order was sent to aws

The setting "asynchronous = true" in the aws.ini means:

* You will always get a 250 OK response
* The SMTP response is before the order was sent to aws

Run:
----
1. goto ascio-smtp-to-aws
2. haraka -c haraka


Howto Test:
-----------
1. configure 
2. send a mail to an hostname that is defined in the file config/host_list (eg.: ascio@localhost)
3. from-address can be any address. Subject can be any subject
4. http://www.jetmore.org/john/code/swaks/ is a good tool for testing SMTP


Haraka can do TLS and has several AuthPlugins. The default setting is no authentification and no encryption. It is best to run the gateway on the same machine as the domain-tool. However, if you need higher secury haraka can do it. 