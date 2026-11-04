```bash
ssl:redacted.com http.html:admin
```
### Shodan Dorking
```bash
ssl:"Target.com" 200 or 300
ssl:"Target.com" 200 -http.title:"VMware" applying filters
Ssl.cert.subject.CN:"target.com" -http.title:"Invalid URL"] 403,401
```

```
if large scope and own by its company so we use Org/SSL
- Search engine to search IOT that are connected with internet.
- Like web cams,traffic signals , server and computers etc.
- We cans search through port, OS or hardware etc.
```
### Through ASN
```bash
- asn:"asASIN"
- to remove the specific services use -
- asn: "as3628" -http.title:"facebook" this will not add the services with http title of facebook.
- To get ssl certificate detail firest visit the site and get the certificate name and then apply filter on shodan like
- ssl:"Meta Platforms, Inc."
- you will see milion of result but we filter it
- ssl.cert.subject.cn:"facebook.com"
- 403 forbidden access denied is interesting error code.
```
##### Shodan Terminal
```bash
- sudo pip install shodan
- shodan init api_key shodan account ⇒ api key
- shodan host ip
- shodan honeyscore ip check honeypot on website
- shodan alternative **HunterHow**
```

