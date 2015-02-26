# ascio-smtp-to-aws
SMTP Server plugin for Haraka (NodeJS). Mail-Gateway that receives mail from Haraka and forwards it to the Ascio Web Service via SOAP.

Installation:
--------------

1. Download and install Haraka: https://github.com/baudehlo/Haraka
2. Download and install ascio-smtp-to-aws: git clone https://github.com/baudehlo/Haraka.git

Configuration:
---------------

* Edit config/aws.ini to add your credentials
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


