subdomain enumeration can be actively or passively. In active subdomain enumeration we directly engage with target so it can generate logs and can be blocked by firewall so stealth it imp technique.

**Enumeration DNS Bruteforce**
Some of the popularly known DNS wordlists from [SECLIST](https://github.com/danielmiessler/SecLists/tree/master/Discovery/DNS), [ASSETNOTE](https://wordlists-cdn.assetnote.io/data/manual/ best-dns-wordlist.txt) and [Rapid Forward DNS](https://opendata.rapid7. com/sonar.fdns_v2/) can be utilized for this purpose.

**DNS VALIDATOR**
When enumerating subdomains, tools often default to using DNS resolvers provided by your internet service provider (ISP) or commonly used ones like Google’s 8.8.8.8. However, these may not be the most reliable due to potential rate limits on the number of requests from a single IP, and they might also be subject to geographical restrictions. Therefore, before starting subdomain enumeration, it’s important to verify that the DNS resolver is supported so use [DNS_Resolver](https://github.com/vortexau/dnsvalidator).

```bash
dnsvalidator -tL https://public-dns.info/nameservers. txt -threads 100 -o resolvers.txt
```

![[Screenshot_2025-07-19_07-22-33.png]]

**ShuffleDNS**
[ShuffleDNS](https://github.com/projectdiscovery/shuffledns) is subdomain enumeration written in “Go” programming, which is the language known for its speed and concurrency. DNS Wildcard is a feature in DNS configuration that allows for the automatic resolution of all non-existent subdomains to a specific IP address. For instance, if a subdomain, such as tmgm.paypal.com, does not exist, the DNS server, configured with a wildcard, will resolve it to a specified IP address instead of returning the standard NXDOMAIN (non-existent domain) response.

```bash
shuffledns -d paypal.com -w subdomains-top1million-5000. txt -r resolvers.txt
```

**SUBBRUTE:**
Subbrute is a Python-based subdomain enumeration tool. 
```bash
python3 subbrute.py sub-wordlist.txt paypal.com | massdns -r resolvers.txt -o S -w output.txt
```

**GOBUSTER** 
Gobuster is yet another enumeration tool, primarily used for subdomain enumeration. However, it goes beyond just subdomains and can also find open Amazon S3 buckets, Google Cloud buckets, and more.

```bash
gobuster dns -w n0kovo_subdomains.txt -d paypal.com -t 50
```

**Subdomain Enumeration From Content Security Policy**
Content Security Policy (CSP) header allows administrators to specify which domains and subdomains are allowed to load content such as scripts, frame sources, image sources, and so forth on their website.
![[1 3.png]]

```bash
curl -I -s https://api-s.sandbox.paypal.com | grep -iE 'content-security-policy|CSP' |tr " " "\n" | grep "\." | tr -d ";" | sed 's/\*\.//g' | sort -u
```

**Subdomain Enumeration Using Favicon Hashes**
When subdomains of a website use the same favicon, each favicon will have the same hash value. By analyzing and comparing these hash values, it is possible to enumerate subdomains.
For instance, if we were to apply this technique to PayPal, we would first gather the favicon hashes for various PayPal subdomains. If multiple subdomains use the same favicon, they will have same hash values.

![[1 4.png]]

```bash
curl -s www.paypalobjects.com/webstatic/icon/favicon.ico -o favicon.ico
```

after downloading we will get its hash using Murmur_hash which is 32 bit hash which is calculated from its contents. We will do this using python module mmh3.
```
cat favicon.ico | base64 | python3 -c "import mmh3, sys; 
print(mmh3.hash(sys.stdin.buffer.read()))"
```

![[1 5.png]]

**Using Shodan Search**
The next step involves searching for the hash on Shodan to retrieve more domains using the same favicon.
```bash
Http.favicon.hash:309020573
```

This entire process from fetching the favicon to searching and retrieving subdomains via Shodan can be automated using a combination of curl command with Python code.
```bash
curl -s target.com/favicon.ico | base64 | python3 -c 'import mmh3, sys;print(mmh3. hash(sys.stdin.buffer.read()))' | xargs -I{} shodan search http.favicon.hash:{} --fields hostnames | tr ";" "\n"
```

