JavaScript files we can use the previously collected data of web archives and crawlers.
```bash
grep "\.js" paypal.txt | sort -u | httpx -silent -mc 200 -o paypal-js.txt
```

After identifying the JavaScript files, the next step involves discovering endpoints and their parameters within these files. This process can be automated using a Python tool called [LinkFinder](https://github.com/GerbenJavado/LinkFinder).
```bash
while read url; do. /linkfinder.py -i $url -o cli >> paypal-endpoinsts.txt;done <.. /paypal-js.txt
```
![[Screenshot_2025-07-22_03-16-52.png]]

**Extracting Sensitive Data:**
```bash
python3 SecretFinder.py -i https://example.com/1.js -o cli
```

**Enumerating Input Parameters**
various tools available for fuzzing hidden parameters, however [Arjun](https://github.com/s0md3v/Arjun) stands out as a popular choice in the security community. This tool is particularly focused at uncovering the hidden parameters in web applications.
```bash
arjun -u https://paypal.com/pay.php
```
we can provide custom wordlist for parameter to arjun tool.
![[Screenshot_2025-07-22_03-16-52 1.png]]

We can create out custom wordlist using Gau and Unfurl.
```bash
echo tesla.com | gau --subs | grep '=' | unfurl keys |sort -u
```
or 
```bash
gau tesla.com | unfurl --unique keys
```
Gau will gather all tesla subdomains url the then grep separate them with = and unurl will choose key part and then sort them.


