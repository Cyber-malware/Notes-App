Web cache deception is a vulnerability that enables an attacker to trick a web cache into storing sensitive, dynamic content. It's caused by discrepancies between how the cache server and origin server handle requests.
![[Pasted image 20251014082527.png]]
```
- Web cache poisoning manipulates cache keys to inject malicious content into a cached response, which is then served to other users.
- Web cache deception exploits cache rules to trick the cache into storing sensitive or private content, which the attacker can then access.
```


![[Pasted image 20251014083723.png]]
### Web Caches:
A web cache is a system that sits between the origin server and the user. When a client requests a static resource, the request is first directed to the cache. If the cache doesn't contain a copy of the resource (known as a cache miss), the request is forwarded to the origin server

### Cache keys

When the cache receives an HTTP request, it must decide whether there is a cached response that it can serve directly, or whether it has to forward the request to the origin server. The cache makes this decision by generating a 'cache key' from elements of the HTTP request.

### Cache Rules:
Cache rules are implemented mostly to store static data.This attack depend how cache rules are implemented.

static file extension specially for `css` or `js` files.
Static directory match url path. `/static` or `/assets`.
File name rules specially `robots.txt` or `favicon.ico`