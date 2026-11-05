
Web cache poisoning is vulnerability were user get malicious version of java-script.

Attacker request the for response and make js vulnerable. Cache server store copie of response for later use. When another user make request cache server provide same copie of response that vulnerable to js to other user.

![[Cache_Poison.png]]

```
Attacker ==> Cache ==> Server
	 <==       <==

user1	==> Cache
	<== 

user2	==> Cache
	<== 

user3	==> Cache
	<== 

```

for this server must able to accept extra parameter. 
```
like /home?abc=123          //server treat as query string 
like /home/abc=123          //server treat as url path show 404
```
cache key is based on url path