using xmlrpc other website communicate with wordpress.
use cmsmap and wpscan  for testing wpsite

```
wpscan --url <target> --api-token  <apikey>
wpscan --url <target> -e vp -t 30
```

`inurl:/xmlrpc.php?rsd`

check  `/wp-json/wp/v2/users`

check xmrpc if it list the methods and used it
try to find senstive hidden directories
Use  tool [xmlrpc-scan](https://github.com/devpwn/xmlrpc-scan)

```bash
sudo apt install socat 
sudo socat tcp-listen:80,reuseaddr,fork -
./ngrok http 80
```
