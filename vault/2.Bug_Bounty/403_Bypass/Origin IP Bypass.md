
`dnsrecon -d site.com       //then check ips
`wfw00f site.com    //check waf`
`ssl.cert.subject.CN:"site.com" 200  //check on shodan`
`nmap --script ssl-cert -p 443 ip  //check ssl cert agter getting ip`

`shodan search Ssl.cert.subject.CN:"site.com" 200 --fields ip_str | httpx-toolkit -sc -title -server -td   //ip adress result with server/title info`

`favicons.teamtailor-cdn.com      //get favicon url`
`favicon-hash.kmsec.uk       //generate favicon hash`
`http.favicon.hash:hash     //search on shodan and sensos`
`Viewdnsinfo             //enter domain and test ips`
`check SPF record           //use mxroolbox.com`
`securitytrails.com and censys.io     // add site name`
`en.fofa.info           //also cehck for ips use filters`
`zoomeye.hk                 //check for ips too`

Use Tool [cloudflair](https://github.com/christophetd/CloudFlair) for ip.


Use script for IP from VirusTotal.
```bash
#!/bin/bash

# API keys (replace with your own keys)
VT_API_KEY="d387624f1b36d2a91f46e5af310bebce241f09cc1666e42038a43094d85d5184"

# Function to fetch IP addresses from VirusTotal
fetch_vt_ips() {
    local domain=$1
    curl -s "https://www.virustotal.com/vtapi/v2/domain/report?domain=$domain&apikey=$VT_API_KEY" \
        | jq -r '.. | .ip_address? // empty' \
        | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}'
}

# Function to fetch IP addresses from AlienVault
fetch_otx_ips() {
    local domain=$1
    curl -s "https://otx.alienvault.com/api/v1/indicators/hostname/$domain/url_list?limit=500&page=1" \
        | jq -r '.url_list[]?.result?.urlworker?.ip // empty' \
        | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}'
}

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <domain_name_or_url>"
    exit 1
fi

DOMAIN=$1
OUTPUT_FILE="${DOMAIN}_ips.txt"

# Get IPs from both sources, remove duplicates, and save to file
echo "Collecting IP addresses for: $DOMAIN"
{
    fetch_vt_ips $DOMAIN
    fetch_otx_ips $DOMAIN
} | sort -u | tee "$OUTPUT_FILE"

echo "-------------------------"
echo "IP addresses saved to: $OUTPUT_FILE"
```