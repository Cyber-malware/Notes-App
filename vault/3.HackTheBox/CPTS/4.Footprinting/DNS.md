`Domain Name System` (`DNS`) is an integral part of the Internet. DNS is a system for resolving computer names into IP addresses, and it does not have a central database. There are several types of DNS servers that are used worldwide.

| **Server Type**                   | **Description**                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **DNS Root Server**               | Top-level servers that handle **TLDs** (like `.com`, `.org`, etc.). There are **13** root server clusters globally, managed by **ICANN**. Called **only when others can't resolve** a name.            |
| **Authoritative Name Server**     | Holds definitive records (A, MX, TXT, etc.) for a **specific domain or zone**. Answers queries about domains it's responsible for. Essential for delivering the final answer in resolution.            |
| **Non-authoritative Name Server** | Returns answers it has learned from others (not responsible for the data). It **relays** DNS records from authoritative sources but doesn't own the data.                                              |
| **Caching DNS Server**            | Temporarily **stores previously resolved queries** to speed up future requests. Reduces DNS traffic and load on authoritative servers. Cache TTL (time-to-live) is defined by the original DNS record. |
| **Forwarding Server**             | Forwards requests to another DNS server, often used to centralize or control outbound DNS traffic (e.g., corporate DNS setups).                                                                        |
| **Resolver (Stub Resolver)**      | Lives on the **client device** or router. It's the first step in DNS resolution. Sends queries to a recursive DNS server to do the "real" work.                                                        |
DNS is mainly unencrypted. Devices on the local WLAN and Internet providers can therefore hack in and spy on DNS queries.  By default, IT security professionals apply `DNS over TLS` (`DoT`) or `DNS over HTTPS` (`DoH`) here. In addition, the network protocol `DNSCrypt` also encrypts the traffic between the computer and the name server.

![[Pasted image 20250803080426.png]]
Different `DNS records` are used for the DNS queries, which all have various tasks.

| **DNS Record** | **Description**                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `A`            | Returns an IPv4 address of the requested domain as a result.                                                                                                                                                                                      |
| `AAAA`         | Returns an IPv6 address of the requested domain.                                                                                                                                                                                                  |
| `MX`           | Returns the responsible mail servers as a result.                                                                                                                                                                                                 |
| `NS`           | Returns the DNS servers (nameservers) of the domain.                                                                                                                                                                                              |
| `TXT`          | This record can contain various information. The all-rounder can be used, e.g., to validate the Google Search Console or validate SSL certificates. In addition, SPF and DMARC entries are set to validate mail traffic and protect it from spam. |
| `CNAME`        | This record serves as an alias for another domain name. If you want the domain www.hackthebox.eu to point to the same IP as hackthebox.eu, you would create an A record for hackthebox.eu and a CNAME record for www.hackthebox.eu.               |
| `PTR`          | The PTR record works the other way around (reverse lookup). It converts IP addresses into valid domain names.                                                                                                                                     |
| `SOA`          | Provides information about the corresponding DNS zone and email address of the administrative contact.                                                                                                                                            |
The `SOA` record is located in a domain's zone file and specifies who is responsible for the operation of the domain and how DNS information for the domain is managed.
```bash
dig soa www.inlanefreight.com

; <<>> DiG 9.16.27-Debian <<>> soa www.inlanefreight.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 15876
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;www.inlanefreight.com.         IN      SOA

;; AUTHORITY SECTION:
inlanefreight.com.      900     IN      SOA     ns-161.awsdns-20.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400

;; Query time: 16 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Thu Jan 05 12:56:10 GMT 2023
;; MSG SIZE  rcvd: 128
```

All DNS servers work with three different types of configuration files:
1. local DNS configuration files
2. zone files
3. reverse name resolution files
The DNS server  [Bind9](https://www.isc.org/bind/) used in Linux distributions and localy configured file `named.conf` which divided into two sections. First Option section for general setting and second zone entries for individual domain.
`named.conf.local`
`named.conf.options`
`named.conf.log`

It contain associated RFC where we can customize server to our needs and out domain structure with individual zones for differ domains. The configuration file `named.conf` is divided into several options that control the behavior of the name server. A distinction is made between `global options` and `zone options`.

Global options are general and affect all zones. A zone option only affects the zone to which it is assigned. Options not listed in named.conf have default values. If an option is both global and zone-specific, then the zone option will used.

#### **Local DNS configuration:**
```bash
root@bind9:~# cat /etc/bind/named.conf.local

//
// Do any local configuration here
//

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";
zone "domain.com" {
    type master;
    file "/etc/bind/db.domain.com";
    allow-update { key rndc-key; };
};
```

In this we can define differ zones which are divided into individual file. Mainly intended for one domain. except ISP and DNS server. The BIND file format is the industry-preferred zone file format and is now well established in DNS server software. A zone file describes a zone completely.
Their must be at least one `SOA` and `NS`  in record. `SOA` located at beginning of file and main goal is to improve read ability. Syntax error at beginning consider as fail and sent message DNS query as `SERVFAIL`.
#### **Zone Files**
```bash
cat /etc/bind/db.domain.com

;
; BIND reverse data file for local loopback interface
;
$ORIGIN domain.com
$TTL 86400
@     IN     SOA    dns1.domain.com.     hostmaster.domain.com. (
                    2001062501 ; serial
                    21600      ; refresh after 6 hours
                    3600       ; retry after 1 hour
                    604800     ; expire after 1 week
                    86400 )    ; minimum TTL of 1 day

      IN     NS     ns1.domain.com.
      IN     NS     ns2.domain.com.

      IN     MX     10     mx.domain.com.
      IN     MX     20     mx2.domain.com.

             IN     A       10.129.14.5

server1      IN     A       10.129.14.5
server2      IN     A       10.129.14.7
ns1          IN     A       10.129.14.2
ns2          IN     A       10.129.14.3

ftp          IN     CNAME   server1
mx           IN     CNAME   server1
mx2          IN     CNAME   server2
www          IN     CNAME   server2
```

#### **Reverse Name Resolution Zone Files**
ind the domain name from an IP address called Reverse lookup and finding ip from domain called forward lookup.For the IP address to be resolved from the `Fully Qualified Domain Name` (`FQDN`), the DNS server must have a reverse lookup file.
```bash
cat /etc/bind/db.10.129.14

;
; BIND reverse data file for local loopback interface
;
$ORIGIN 14.129.10.in-addr.arpa
$TTL 86400
@     IN     SOA    dns1.domain.com.     hostmaster.domain.com. (
                    2001062501 ; serial
                    21600      ; refresh after 6 hours
                    3600       ; retry after 1 hour
                    604800     ; expire after 1 week
                    86400 )    ; minimum TTL of 1 day

      IN     NS     ns1.domain.com.
      IN     NS     ns2.domain.com.

5    IN     PTR    server1.domain.com.
7    IN     MX     mx.domain.com.
...SNIP...
```

This reverse lookup file contain records called **PTR records**. Each PTR record links the last part of an IP address (the last number in the IP) to a domain name.
## Dangerous Settings:
There are many ways in which a DNS server can be attacked. For example, a list of vulnerabilities targeting the BIND9 server can be found at [CVEdetails](https://www.cvedetails.com/product/144/ISC-Bind.html?vendor_id=64). In addition, SecurityTrails provides a short [list](https://web.archive.org/web/20250329174745/https://securitytrails.com/blog/most-popular-types-dns-attacks) of the most popular attacks on DNS servers.
DNS can get very complicated and it is very easy for errors to creep into this service, forcing an administrator to work around the problem until they find an exact solution.

|**Option**|**Description**|
|---|---|
|`allow-query`|Defines which hosts are allowed to send requests to the DNS server.|
|`allow-recursion`|Defines which hosts are allowed to send recursive requests to the DNS server.|
|`allow-transfer`|Defines which hosts are allowed to receive zone transfers from the DNS server.|
|`zone-statistics`|Collects statistical data of zones.|
#### **DIG - NS Query**:
One common way is to ask a DNS server which other name servers it knows about for a particular domain. This is done by querying the **NS (Name Server) records**.
You use the `@` symbol to specify which DNS server you want to ask. Finding `FQDN` of website here `ns` is FQDN from `ns.inlanefreight.htb`.
```bash
dig ns inlanefreight.htb @10.129.14.128

; <<>> DiG 9.16.1-Ubuntu <<>> ns inlanefreight.htb @10.129.14.128
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45010
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: ce4d8681b32abaea0100000061475f73842c401c391690c7 (good)
...

;; ADDITIONAL SECTION:
ns.inlanefreight.htb.   604800  IN      A       127.0.0.1

;; Query time: 156 msec
;; SERVER: 10.129.42.195#53(10.129.42.195) (UDP)
;; WHEN: Mon Aug 04 10:51:54 EDT 2025
;; MSG SIZE  rcvd: 107

```

Some DNS servers are configured to respond to a special query that asks for their version. This query uses:
- **Class CHAOS (CH)** — a special DNS class used for querying server metadata.
- **Type TXT** — because the version information is returned as a text string.
- The name **version.bind** — a conventional name used to request the version string from the DNS server.
```bash
dig CH TXT version.bind 10.129.120.85

; <<>> DiG 9.10.6 <<>> CH TXT version.bind
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 47786
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
...
```

We can use any options to show all available information.
```bash
dig any inlanefreight.htb @10.129.14.128

; <<>> DiG 9.16.1-Ubuntu <<>> any inlanefreight.htb @10.129.14.128
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 7649
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 2
...
```

`Zone transfer` refers to the transfer of zones to another server in DNS, which generally happens over TCP port 53. This procedure is abbreviated `Asynchronous Full Transfer Zone` (`AXFR`). Companies has to kept same files on all DNS servers if some changes are made so with `rndc-key` data exchanged between servers.

The original data of a zone is located on a DNS server, which is called the `primary` name server. To prevent from attacks files distributed over secondary server and at least two are mandatory.

DNS entries are generally only created, modified, or deleted on the primary. Changes in primary are done manually or automatically and file on primary know as master and on secondary server can be called master/slave.
#### **DIG - AXFR Zone Transfer**
```bash
dig axfr inlanefreight.htb @10.129.14.128

; <<>> DiG 9.16.1-Ubuntu <<>> axfr inlanefreight.htb @10.129.14.128
;; global options: +cmd
inlanefreight.htb.      604800  IN      SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
inlanefreight.htb.      604800  IN      TXT     "MS=ms97310371"
inlanefreight.htb.      604800  IN      TXT     "atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
inlanefreight.htb.      604800  IN      TXT     "v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
inlanefreight.htb.      604800  IN      NS      ns.inlanefreight.htb.

;; Query time: 0 msec
;; SERVER: 10.129.14.128#53(10.129.14.128)
;; WHEN: So Sep 19 18:53:11 CEST 2021
;; XFR size: 15 records (messages 1, bytes 664)
```

The **allow-transfer** option in a DNS server controls which clients are allowed to perform zone transfers. `internal` usually means **restricted or non-public services**.
#### DIG - AXFR Zone Transfer - Internal:
```bash
dig axfr internal.inlanefreight.htb @10.129.14.128

; <<>> DiG 9.16.1-Ubuntu <<>> axfr internal.inlanefreight.htb @10.129.14.128
;; global options: +cmd
internal.inlanefreight.htb. 604800 IN   SOA     inlanefreight.htb. root.inlanefreight.htb. 2 604800 86400 2419200 604800
internal.inlanefreight.htb. 604800 IN   TXT     "MS=ms97310371"
internal.inlanefreight.htb. 604800 IN   TXT     "atlassian-domain-verification=t1rKCy68JFszSdCKVpw64A1QksWdXuYFUeSXKU"
internal.inlanefreight.htb. 604800 IN   TXT     "v=spf1 include:mailgun.org include:_spf.google.com include:spf.protection.outlook.com include:_spf.atlassian.net ip4:10.129.124.8 ip4:10.129.127.2 ip4:10.129.42.106 ~all"
internal.inlanefreight.htb. 604800 IN   NS      ns.inlanefreight.htb.

;; Query time: 0 msec
;; SERVER: 10.129.14.128#53(10.129.14.128)
;; WHEN: So Sep 19 18:53:11 CEST 2021
;; XFR size: 15 records (messages 1, bytes 664)
```

The individual `A` records with the hostnames can also be found out with the help of a brute-force attack. To do this, we need a list of possible hostnames, which we use to send the requests in order. Such lists are provided, for example, by [SecLists](https://github.com/danielmiessler/SecLists/blob/master/Discovery/DNS/subdomains-top1million-5000.txt).
```bash
 for sub in $(cat /opt/useful/seclists/Discovery/DNS/subdomains-top1million-110000.txt);do dig $sub.inlanefreight.htb @10.129.14.128 | grep -v ';\|SOA' | sed -r '/^\s*$/d' | grep $sub | tee -a subdomains.txt;done

ns.inlanefreight.htb.   604800  IN      A       10.129.34.136
mail1.inlanefreight.htb. 604800 IN      A       10.129.18.201
app.inlanefreight.htb.  604800  IN      A       10.129.18.15
```
we can also use [DNSenum](https://github.com/fwaeytens/dnsenum).
```bash
dnsenum --dnsserver 10.129.14.128 --enum -p 0 -s 0 -o subdomains.txt -f /opt/useful/seclists/Discovery/DNS/subdomains-top1million-110000.txt inlanefreight.htb

-----   inlanefreight.htb   -----

ns.inlanefreight.htb.                    604800   IN    A        10.129.34.136

ns.inlanefreight.htb.                    604800   IN    A        10.129.34.136
mail1.inlanefreight.htb.                 604800   IN    A        10.129.18.201
app.inlanefreight.htb.                   604800   IN    A        10.129.18.15
ns.inlanefreight.htb.                    604800   IN    A        10.129.34.136

...SNIP...
```

