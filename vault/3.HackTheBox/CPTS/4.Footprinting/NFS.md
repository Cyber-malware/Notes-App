- **Developed by:** Sun Microsystems
- **Purpose:** Access remote file systems as local
- **Similar to:** SMB (but uses a different protocol)
- **Platform:** Used between **Linux/Unix systems** (not compatible with SMB)
- **Standard:** Internet-standard for distributed file systems
- **NFSv3:** Authenticates **client machine**   
- **NFSv4:** Authenticates **individual users** (like SMB)

|**Version**|**Features**|
|---|---|
|`NFSv2`|It is older but is supported by many systems and was initially operated entirely over UDP.|
|`NFSv3`|It has more features, including variable file size and better error reporting, but is not fully compatible with NFSv2 clients.|
|`NFSv4`|It includes Kerberos, works through firewalls and on the Internet, no longer requires portmappers, supports ACLs, applies state-based operations, and provides performance improvements and high security. It is also the first version to have a stateful protocol.|
**NFSv4.1** (RFC 8881) supports clustered server setups and scalable parallel file access using the **pNFS extension**. It introduces **session trunking (multipathing)** for improved performance. Unlike earlier versions, NFSv4 uses only **TCP/UDP port 2049**, simplifying firewall configuration.

NFS is built on **ONC-RPC (SUN-RPC)**, which uses **XDR** for system-independent data exchange and operates over **port 111**. NFS lacks its own authentication and authorization; instead, it relies on **RPC-level authentication** and **UNIX UID/GID-based authorization**. A mismatch in UID/GID mappings between client and server can cause permission issues. Therefore, NFS should be used with this method only on **trusted networks**.

|Concept|Meaning|
|---|---|
|**ONC-RPC / SUN-RPC**|The protocol NFS uses to talk over the network (port 111)|
|**XDR**|Makes sure data is in a standard format|
|**No built-in authentication**|NFS trusts what the client says about its user ID|
|**UID/GID system**|UNIX way of identifying users — but must match on both client and server|
|**Security Risk**|Untrusted clients can impersonate users if not protected|
## Default Configuration:
It has small configuration file with location `/etc/exports`. The [NFS Exports Table](http://manpages.ubuntu.com/manpages/trusty/man5/exports.5.html) shows which options it accepts and thus indicates which options are available to us.

```bash
[!bash!]$ cat /etc/exports 

# /etc/exports: the access control list for filesystems which may be exported
#               to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
```

```bash
<directory-to-share>  <client1>(options) <client2>(options)
```

| Option                | Meaning                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `rw`                  | Read and write access                                                                                                                       |
| `ro`                  | Read-only access                                                                                                                            |
| `sync`                | Write changes immediately (safer)                                                                                                           |
| `async`               | Allow delayed writes (faster, but risky)                                                                                                    |
| `no_subtree_check`    | Skip file path validation for performance                                                                                                   |
| `subtree_check`       | Do full file path validation (default, but slower)                                                                                          |
| `fsid=0`              | Needed for root of NFSv4 exports                                                                                                            |
| `crossmnt`            | Allow exports to span mounted subdirectories                                                                                                |
| `secure` / `insecure` | Limit client connections to certain ports (default is `secure`)                                                                             |
| `root_squash`         | Assigns all permissions to files of root UID/GID 0 to the UID/GID of anonymous, which prevents `root` from accessing files on an NFS mount. |
| `insecure`            | Ports above 1024 will be used.                                                                                                              |
| `no_subtree_check`    | This option disables the checking of subdirectory trees.                                                                                    |
Lets create an entry.
```bash
echo '/mnt/nfs  10.129.14.0/24(sync,no_subtree_check)' >> /etc/exports
systemctl restart nfs-kernel-server 
exportfs

/mnt/nfs      	10.129.14.0/24
```

We have shared the folder `/mnt/nfs` to the subnet `10.129.14.0/24` with the setting shown above. This means that all hosts on the network will be able to mount this NFS share and inspect the contents of this folder.

## Dangerous Settings:
|**Option**|**Description**|
|---|---|
|`rw`|Read and write permissions.|
|`insecure`|Ports above 1024 will be used.|
|`nohide`|If another file system was mounted below an exported directory, this directory is exported by its own exports entry.|
|`no_root_squash`|All files created by root are kept with the UID/GID 0.|
Always check for port 111 and 2049.
```bash
 sudo nmap 10.129.14.128 -p111,2049 -sV -sC
```

The `rpcinfo` NSE script retrieves a list of all currently running RPC services, their names and descriptions, and the ports they use. Let us check whether target is connected to network on all required ports.
```bash
sudo nmap --script nfs* 10.129.14.128 -sV -p111,2049

Starting Nmap 7.80 ( https://nmap.org ) at 2021-09-19 17:37 CEST
Nmap scan report for 10.129.14.128
Host is up (0.00021s latency).

PORT     STATE SERVICE VERSION
111/tcp  open  rpcbind 2-4 (RPC #100000)
| nfs-ls: Volume /mnt/nfs
|   access: Read Lookup NoModify NoExtend NoDelete NoExecute
| PERMISSION  UID    GID    SIZE  TIME                 FILENAME
| rwxrwxrwx   65534  65534  4096  2021-09-19T15:28:17  .
| ??????????  ?      ?      ?     ?                    ..
| rw-r--r--   0      0      1872  2021-09-19T15:27:42  id_rsa
| rw-r--r--   0      0      348   2021-09-19T15:28:17  id_rsa.pub
| rw-r--r--   0      0      0     2021-09-19T15:22:30  nfs.share
...
```

Once we have discovered such an NFS service, we can mount it on our local machine. For this, we can create a new empty folder to which the NFS share will be mounted. Once mounted, we can navigate it and view the contents just like our local system.

#### Show Available NFS Shares

```bash
showmount -e 10.129.14.128

Export list for 10.129.14.128:
/mnt/nfs 10.129.14.0/24
```

#### Mounting NFS Share

```bash
[!bash!]$ mkdir target-NFS
[!bash!]$ sudo mount -t nfs 10.129.14.128:/ ./target-NFS/ -o nolock
[!bash!]$ cd target-NFS
[!bash!]$ tree .

.
└── mnt
    └── nfs
        ├── id_rsa
        ├── id_rsa.pub
        └── nfs.share

2 directories, 3 files
```

There we will have the opportunity to access the rights and the usernames and groups to whom the shown and viewable files belong. Because once we have the usernames, group names, UIDs, and GUIDs, we can create them on our system and adapt them to the NFS share to view and modify the files.

#### List Contents with Usernames & Group Names

```bash
[!bash!]$ ls -l mnt/nfs/

total 16
-rw-r--r-- 1 cry0l1t3 cry0l1t3 1872 Sep 25 00:55 cry0l1t3.priv
-rw-r--r-- 1 cry0l1t3 cry0l1t3  348 Sep 25 00:55 cry0l1t3.pub
-rw-r--r-- 1 root     root     1872 Sep 19 17:27 id_rsa
-rw-r--r-- 1 root     root      348 Sep 19 17:28 id_rsa.pub
-rw-r--r-- 1 root     root        0 Sep 19 17:22 nfs.share
```

#### List Contents with UIDs & GUIDs

```bash
[!bash!]$ ls -n mnt/nfs/

total 16
-rw-r--r-- 1 1000 1000 1872 Sep 25 00:55 cry0l1t3.priv
-rw-r--r-- 1 1000 1000  348 Sep 25 00:55 cry0l1t3.pub
-rw-r--r-- 1    0 1000 1221 Sep 19 18:21 backup.sh
-rw-r--r-- 1    0    0 1872 Sep 19 17:27 id_rsa
-rw-r--r-- 1    0    0  348 Sep 19 17:28 id_rsa.pub
-rw-r--r-- 1    0    0    0 Sep 19 17:22 nfs.share
```

It is important to note that if the `root_squash` option is set, we cannot edit the `backup.sh` file even as `root`.

We can also use NFS for further escalation. For example, if we have access to the system via SSH and want to read files from another folder that a specific user can read, we would need to upload a shell to the NFS share that has the `SUID` of that user and then run the shell via the SSH user.

After we have done all the necessary steps and obtained the information we need, we can unmount the NFS share.

#### Unmounting

```bash
[!bash!]$ cd ..
[!bash!]$ sudo umount ./target-NFS
```