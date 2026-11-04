 An autonomous system number (ASN) is a unique identifier assigned to an 
organization or company. It represents a collection of IP addresses that belong 
to that entity.we can use [bgp site](https://bgp.he.net/)
![[1 1.png]]

 From these ASNs, we can then determine the IP ranges assigned to Paypal.
 ![[2 1.png]]

 For ASN CLI
 ```bash
  curl -s https://api.bgpview.io/search?query_term=paypal | jq
```

Nmap script “target-asn” can also be utilized for extracting IP ranges based upon an ASN.
```bash
nmap --script targets-asn --script-args targets-asn.asn=26444
```

use a Bash script to scan through the IP ranges of Yahoo to find instances of “phpinfo.php”, a file that can contain valuable server information.
```bash
for ipa in 98.13{6..9}.{0..255}.{0..255}; do wget -t 1 -T 5 http://${ipa}/phpinfo.php; done &
```

**Reverse IP Lookup**

Reverse IP lookup involves querying an IP address to identify domains hosted on the same IP address. This is popular across shared hosting environments, where multiple domains are hosted on same IP address. Sites like YouGetSignal, ViewDNS.info, rapiddns.io, and many others.
![[1 2.png]]

we can use curl command to extract domain information from RapidDNS for a specific IP range associated with PayPal.
```bash
curl -s 'https://rapiddns.io/sameip/64.4.250.0/24?full=1#result' | grep 'target="' -B1 | egrep -v '(--|) ' | rev | cut -c 6- | rev | cut -c 5- | sort -u
```

**MULTI-THREADINGS**
To expedite the process of Reverse IP Lookups, especially when querying multiple IP addresses simultaneously, [multi-threading](https://github.com/codingo/Interlace) can be used.
```bash
interlace -tL ip.txt -c "curl -s ' https://rapiddns.io/sameip/_target_?full=1#result' | grep 'target=' -B1 | egrep -v '(--|) ' | rev | cut -c 6- | rev | cut -c 5- | sort -u >> output.txt" -threads 2 --silent --no-color --no-bar
```

**SCANNING WITH MASSCAN**
Masscan is very fast and efficient for port scanning then nmap.
```bash
sudo masscan --open-only 10.22.144.0/24 -p1-65535,U:1-65535 --rate=10000 --http-user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0" -oL "output.txt"
```

**HTTP SERVICES BY RUNNING HTTPX**
```bash
cat output.txt | grep tcp | awk ' {print $4,":",$3}' | tr -d ' ' | httpx -title -sc -cl
```

**Scanning for Service Versions**
After scan the open ports with masscan we will scan for services version and nmap is best.
scanning in detail will be time consuming for Bug hunters.
```bash
Nmap -sC -sV 10.22.144.147 -T4
```

