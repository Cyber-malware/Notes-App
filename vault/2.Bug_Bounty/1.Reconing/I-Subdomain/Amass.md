**Active + Passive Subdomain Enumeration Using Amass**
[Amass](https://github.com/owasp-amass/amass]) is one of the most advanced subdomain enumeration tools. It combines the best of both worlds including both active and passive subdomain enumerations.

`org` flag, which will return “ASN” and IP blocks associated with it.
```bash
amass intel -org "google"
```

-`asn` flag to return domains and subdomains against a specific asn.
```bash
amass intel -asn 44384
```

`whois` flag used to return domain and subdomains from whois record.
```bash
amass intel -whois -d paypal.com
```

**Amass Enum Module**
active mode utilizes all functions of the Normal mode, extending its capabilities to engage with discovered assets includes efforts to acquire TLS certificates, execute DNS zone transfers, employ nano second walking, and even conduct web crawling.
```bash
amass enum -active -d paypal.com > active_paypal.txt
```

passive scanning of subdomains, we can utilize the “passive” flag part of the enum module.
```
amass enum -passive -d paypal.com > passive_paypal.txt
```

**Amass db Module**
Another unique feature of “amass” is that it has a built-in database. The database stores
information such as discovered domain names, IP addresses, subdomains.
```
amass db -list
```

To retrive the result from database we can use this command.
```
amass db -show -d owasp.org
```

Amass employs the “viz” module, which can be used to visualize the informatiom.These results can be imported into tools like the OSINT tool Maltego for improved visualization and correlation.
```
amass viz -d3 -dir paypal
```

Amass track is a module that enables users to compare results across enumerations performed against the same domains.
```
amass track -d paypal.com
```

