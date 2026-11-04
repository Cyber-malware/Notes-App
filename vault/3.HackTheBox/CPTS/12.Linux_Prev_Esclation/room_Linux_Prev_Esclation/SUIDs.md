Changes with SUID (Set-user Identification) and SGID (Set-group Identification). These allow files to be executed with the permission level of the file owner or the group owner, respectively.User have permission to run files with out sudo permissions.

find files that have SUID and SGID bit set

```bash
find / -type f -perm -04000 -ls 2>/dev/null
```

| Octal  | Meaning         |
| ------ | --------------- |
| `4xxx` | SUID bit set    |
| `2xxx` | SGID bit set    |
| `1xxx` | Sticky bit set  |
| `0xxx` | No special bits |
for `4755` 
- `4` → SUID bit set
- `7` → Owner has read(4) + write(2) + execute(1) = 7
- `5` → Group has read(4) + execute(1) = 5
- `5` → Others have read(4) + execute(1) = 5

- `Read (r) = 4`
- `Write (w) = 2`
- `Execute (x) = 1`

![](Pasted%20image%2020250702225824.png)

check for set [SUIDs](https://gtfobins.github.io/#+suid) and use them.

![](Pasted%20image%2020250702225913.png)

nano have suid set so we can use it to read or write files.

```
nano /etc/shadow
nano /etc/passwd
```

locally save the files and merge them in single file to crack password

```
unshadow passwd.txt shadow.txt > passwords.txt
```

![](Pasted%20image%2020250702230918.png)

**Adding New User:**

The other option would be to add a new user that has root privileges. This would help us circumvent the tedious process of password cracking.

We will need the hash value of the password we want the new user to have. This can be done quickly using the openssl tool on Kali Linux.

![](https://i.imgur.com/bkOGaHY.png)  

We will then add this password with a username to the `/etc/passwd` file.

![](https://i.imgur.com/huGoEtj.png)

Once our user is added (please note how `root:/bin/bash` was used to provide a root shell) we will need to switch to this user and hopefully should have root privileges.  

![](https://i.imgur.com/HZcWGhi.png)  

