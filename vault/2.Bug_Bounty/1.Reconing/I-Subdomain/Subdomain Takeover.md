During enumeration, identifying potential subdomain takeovers often leads to quick wins. A subdomain takeover vulnerability occurs when a subdomain points to a service, such as a web host or cloud service that has been removed or is no longer active. This can arise for various reasons, such as the external service being decommissioned but the DNS record not being updated or removed, or the organization forgetting to renew its subscription for a specific service, leaving the subdomain pointing to an inactive service.

![[1 6.png]]
For further investigation we will use dig command.
```
dig redseclabsto.redseclabs.com
```

![[1 7.png]]

The output of the command indicates that the canonical name (CNAME) is pointing to an S3 bucket record, “redseclabsssto.redseclabs.com.s3.us-west-2.amazon.com” hosted on Amazon Web Services (AWS). Since the bucket does not exist, one can potentially use the AWS console to register a new bucket with the same name and take control.
![[1 8.png]]

![[1 9.png]]

[Subjack](https://github.com/haccer/subjack)
For automated testing we will used subdomaintakeover tool but it provide false positive so check it manually.
```
subjack -w subdomains.txt -t 100 -timeout 30 -o results.txt
```

