### Urls
```bash
gau target.com | anew gau.txt to find url
cat domain.txt or validsub.txt | waybackurls |anew waybck.txt get urls through wayback
katana -u [target.com](https://ynab.com) -jc -d 5 -o katana.txt to find url jc js crawling -d depth
subjs -i validsub.txt | anew subjs.txt
cat * | anew uniqurl.txt uniq the urls
rm -rf gau.txt waybck.txt katana.txt subjs.txt
```
### Js Files
```bash
cat uniqurl.txt | grep "\.js$" | anew js.txt download anyfile that end with .js
cat uniqurl.txt | grep -E "^https?://.*\.js(\?|$)" | sort -u > js.txt only download .js files
```
### Secret Finder
```bash
- grep -iE "\.js(\?.*)?$" urls.txt > js-urls.txt
- cat js.txt | while read url; do python3 ~/Tools/SecretFinder/SecretFinder.py -i $url -o cli >> secret.txt;done
  
// if you want to see url being scanned
while read -r url; do
echo "[*] Scanning $url"
python3 ~/Tools/SecretFinder/SecretFinder.py -i "$url" -o cli >> secret.txt
done < jsfiles.txt
```

### Manual Wayback
```bash

WAYBACK_URL = '[https://web.archive.org/cdx/search/cdx?url=](https://web.archive.org/cdx/search/cdx?url=){DOMAIN}{COLLAPSE}&fl=timestamp,original,mimetype,statuscode,digest'

CCRAWL_INDEX_URL = '[https://index.commoncrawl.org/collinfo.json'](https://index.commoncrawl.org/collinfo.json')

ALIENVAULT_URL = '[https://otx.alienvault.com/api/v1/indicators/](https://otx.alienvault.com/api/v1/indicators/){TYPE}/{DOMAIN}/url_list?limit=500'

URLSCAN_URL = '[https://urlscan.io/api/v1/search/?q=domain:](https://urlscan.io/api/v1/search/?q=domain:){DOMAIN}&size=10000'

VIRUSTOTAL_URL = '[https://www.virustotal.com/vtapi/v2/domain/report?apikey=](https://www.virustotal.com/vtapi/v2/domain/report?apikey=){APIKEY}&domain={DOMAIN}'
```

### Sensitive Info
```bash
grep -r -E "aws_access_key|aws_secret_key|api[_-]?key|passwd|pwd|heroku|slack|firebase|swagger|aws[_-]?key|password|ftp[_-]?password|jdbc|db|sql|secret[_-]?jet|config|admin|json|gcp|htaccess|\.env|ssh[_-]?key|\.git|access[_-]?key|secret[_-]?token|oauth[_-]?token|oauth[_-]?token[_-]?secret|authorization|bearer|apikey|api_secret|private[_-]?key|client[_-]?secret|consumer[_-]?key|consumer[_-]?secret|pat_token|github[_-]?token|gitlab[_-]?token|bitbucket[_-]?key|mailgun|sendgrid|twilio|s3[_-]?bucket|auth[_-]?token|encryption[_-]?key|rsa[_-]?private|pg[_-]?password|mysql[_-]?password|mssql[_-]?password|connection[_-]?string" /path/to/directory/*.js

you can also save these secret words in file grep -r -f patterns.txt /path/to/directory/*.js
```

```bash
- download js Loop through each URL in js_file.txt

cat "$URLS_DIR/js_file.txt" | while read url; do
# Download the JS file (using curl or wget) and search for sensitive info
curl -s "$url" | grep -E "aws_access_key|aws_secret_key|api key|passwd|pwd|heroku|slack|firebase|swagger|aws_secret_key|aws key|password|ftp password|jdbc|db|sql|secret jet|config|admin|pwd|json|gcp|htaccess|.env|ssh key|.git|access key|secret token|oauth_token|oauth_token_secret" >> senesinfo.txt
done

- above one and this one both same
file="js.txt"
# Loop through each line in the file
while IFS= read -r link
do
# Download the JavaScript file using wget
wget "$link"
done < "$file"
```