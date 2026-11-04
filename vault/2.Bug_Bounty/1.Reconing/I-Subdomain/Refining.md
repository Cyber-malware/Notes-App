To remove duplicate we will use sort command with -u.
```
cat * | sort -u > paypal-subdomain.txt
```

Now using Httpx we will exclude duplicate sibdomains.
```
cat paypal-subdomain.txt | httpx -sc -cl --title -o paypal-alive-subdomain.txt
```

we can use [EyeWitness](https://github.com/RedSiege/EyeWitness) can be utilized. The tool is designed to capture screenshots of subdomains, which can then be manually reviewed to analyze their functionality and potential entry points.
```
python3 EyeWitness.py -f paypal-alive-subdomain.txt --web --timeout 50 -d screenshots
```

**Directory Fuzzing:**

[FFUF](https://github.com/ffuf/ffuf) (Fuzz Faster U Fool) is a powerful tool primarily used for fuzzing web applications.We can choose wordlist from [AssetNote](https://wordlists.assetnote.io) wordlists and the [SecLists](https://github.com/danielmiessler/SecLists/tree/master/Discovery/Web-Content)
```
ffuf -w wordlist.txt -u http://demo-site.com/FUZZ -mc 200 -e. php
```

We can also use dirbuster and Gobuster for this.

