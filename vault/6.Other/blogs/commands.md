
`fullport scan quick with min-rate and save to file`
sudo nmap -p- --min-rate=1000 -oA nmap/twomillion-allports -v 10.10.10.14   

`Ouput oA all format`
sudo nmap  -sC -sV -oA nmap/twomillion -p 20,80 10.10.10.14  

check http output and see site is php using php-session id

`For directory searching`
feroxbuster -u https://twommillion.htb 


sudo -s -q  -X POST site | jq .
 sudo -s -q  -X POST site jq .data.code  | base64 -d

