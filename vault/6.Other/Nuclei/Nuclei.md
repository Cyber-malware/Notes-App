A vulnerability scanner tool based on `YAML` templates. 
Location at `/.local/nuclei-templates`
 
```bash
nuclei -h 
nuclei -silent
nuclei -verbose
```

```bash
nuclei -u https://target.com
nuclei -list targ.txt -t  template.yaml
nuclie -t dns -u target.txt          #load templates from dns dir
```

```bash
nuclei -tags ssrf -u https://site.com      # run only template that have ssrf tag
nuclei -etags idor -u https://site.com     # exclude idor
nuclei -itags idor -u https://site.com     # include idor even exclude by default
```

```bash
nuclei -verbose -ts ur https://targe.com     # -ts  scan date and time

nuclei -tags -silent -u https://google.com -json # provide in json format

nuclei -tags -silent -u https://google.com -json | jq 'match-word'

nuclei -u https://google.com -o output  # save in json file

nuclei  -u https://google.com  -sresp  # store http req/res performed during scan
```

```sh
# rl (rate limit), bs (bulk size) c concurency
nuclei -u https://targe.com -t /root/.local/nuclei-templates/ -rl 50 -bs 5 -c 10 
```

```bash
nuclei -tags idor -author geeknik -severity critical,high,medium -u https://site.com

nuclei -pt http -u https://site.com      # filter by protocol

nuclei -tc condition

nuclei -tc "contains(tags,'xss') && contains(tags,'cve')"   # contain tag xss and cve

nuclei -tc "contains(tags,'idor') || contains(tags,'ssrf')"   # contain tag ssrf or idor
```

```bash
nuclei  -template-conditions (conditions) -header "X-Custom0Auth: Bearer super_secret_token" -follow-redirects -max-redirects 10 -verbose -sresp -u https://google.com
```

