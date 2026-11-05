Tools used for passive enumeration gather information from numerous sources, including DNS record archives, search engine caches, certificate transparency logs, and third-party
data aggregators.

**Enumeration with RapidDNS**
It boasts a massive database of five billion records, enabling a comprehensive discovery of subdomains across a wide range of domains.
```bash
curl -s https://rapiddns.io/subdomain/paypal.com?full=1 | grep -Eo '[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}' | sort -u
```

We can also use these tools
```bash
SecurityTrails API: https://api.securitytrails.com
AlienVault OTX API: https://otx.alienvault.com/api
URLScan: https://urlscan.io/
HackerTarget: https://hackertarget.com/
Pentest-Tools: https://pentest-tools.com/
DNSdumpster: https://dnsdumpster.com/
crt.sh: https://crt.sh
```

[Sublist3r](https://github.com/aboul3la/Sublist3r)
it uses serch engines such as Google, Yahoo, Bing, Baidu, and Ask.
```
sublister.py -d domain.com
```
**Enumeration Using GitHub**
[GitHub](https://github.com/gwen001/github-search/blob/master/github-subdomains.py) is a platform used for hosting a wide range of public repositories.
```bash
python3 github-subdomains.py -t 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 -d paypal.com -e
```

**Enumeration Using Subject Alternative Name (SAN)**
When a website uses an SSL/TLS (secure sockets layer/transport layer security) certificate, it often includes a field called “SAN” (Subject Alternative Name). This field contains a list of all domains and subdomains for which
the certificate is valid.
```bash
true | openssl s_client -connect api.paypal.com:443 2>/dev/null | openssl x509 -noout -text | grep "DNS" | tr ',' '\n' | cut -d ":" -f2
```
or 
```bash
openssl s_client -servername corebridgefinancial.com -connect corebridgefinancial.com:443 2>/dev/null | openssl x509 -noout -text | grep -oP 'DNS:[^,\s]+' | cut -d: -f2 
```
**Web Archives for Subdomain Enumeration:**
Contain the subdomain that where active once and now invisible on search engines.
We can also use unfurl with gau to extract subdomain from websites.
```bash
echo example.com | gau --subs | unfurl -u domains | sort -u
```

In this command,“gau --subs” fetches data from web archives, and “unfurl -u
domains” extracts the domains. The “sort -u” part arranges the data.

