It is like swiss army knife and can be used for multiple works. It has active community that helping it up-to-date with new templates and have more then 300 vuln templates.
```bash
nuclei -target http://demo-site.com
```
![[Screenshot_2025-07-22_04-17-06 1.png]]
#### **AWS S3 Buckets Enumeration**
S3 buckets have become popular choices for hosting static content such as HTML, CSS, and JavaScript files.

**Naming Convention and Discovery**
S3 bucket URLs follow a standard naming convention. If you know the bucket name, you can directly access it using the following formats.

```Dorks
site:.s3.amazonaws.com "company"  
site:http://s3.amazonaws.com intitle:index.of.bucket “”  
site:s3.amazonaws.com "index of /" s3  
inurl:s3.amazonaws.com intitle:"AWS S3 Explorer"
```

```
Format: [bucket-name].s3.amazonaws.com
Example: examplebucket.s3.amazonaws.com
```
alternative naming convention exists
```
Format: http://s3.amazonaws.com/[bucket_name]/
Example: http://s3.amazonaws.com/examplebucket/
```

This format is normally used in scenarios where accessing S3 buckets from different regions is required or when dealing with certain DNS and path style access considerations.
```Note
In Amazon S3, each bucket name must be unique across all existing
bucket names in S3 globally.
```

**Identifying S3 Buckets**
A website is hosted on an Amazon S3 bucket can be achieved through a series of investigative steps, primarily utilizing DNS lookup tools. Its specific AWS region can provide aid in understanding a site’s hosting environment.
```bash
host flaws.cloud
```

you can get the region of a bucket, we can perform a dig and nslookup by doing a DNS request of the discovered IP.
```bash
nslookup 52.218.201.195
```

The DNS lookup resolves to “s3-website-us-west-2.amazonaws.com”. It confirms that the hosting is in the AWS region “us-west-2”
```bash
flaws.cloud.s3-website-us-west-2.amazonaws.com
```

**Identifying Buckets Using Google Dorks:**
```bash
site: s3.amazonaws.com paypal.com
```

to search for specific extension use filetype
```bash
site:s3.amazonaws.com filetype:xls password
```

if an S3 bucket was publicly accessible, its contents might have been indexed by search engines or archived by web crawlers or remain with third party data aggregators. This means sensitive data could be cached on these platforms, remaining accessible even after the permissions of the bucket can be changed.

```dorks
Command: site:s3.amazonaws.com filetype:txt password
Description: Search for S3 buckets that contain text files with the word "password"

Command: site:s3.amazonaws.com filetype:sql
Description: Search for S3 buckets that contain SQL files

Command: site:s3.amazonaws.com inurl:backup
Description: Search for S3 buckets that include "backup" in their URLs

Command: site:s3.amazonaws.com intext:apikey
Description: Search for S3 buckets that contain "apikey" in their contents

Command: site:s3.amazonaws.com ext:log
Description: Search for S3 buckets that contain log files
```

To automate this process we can use a  [Buckets](https://buckets.grayhatwarfare.com) that can search for s3 buckets in aws and extend search to azure and digital ocean. 
#### **Tools:**
use the nahamsec tool [lazys3](https://github.com/nahamsec/lazys3) to find S3 bucket.
Try also [s3scanner](https://github.com/sa7mon/S3Scanner) tools. Find open s3 buckets of aws, google ,azure etc after this we can search aws S3 bucket prefixes and download the file.
```bash
ruby lazys3.rb corebridgefinancial          //lazys3 for aws
s3scanner -bucket-file file.txt -enumerate    //test bucket lists
s3scanner -bucket name-of-the-bucket -provider aws  //test single bucket
```
Also read this [article](https://hacktivistattacker.medium.com/cloud-buckets-enumeration-and-exploiting-55820e76cac3).
Try to fuzz the digitalocean bucket
```bash
 ffuf -w ./common_bucket_prefixes.txt:FUZZ -u https://FUZZ.sgp1.digitaloceanspaces.com -mc 200,301,302,403,401
```
#### **AWS s3 CLI:**
If s3 bucket is misconfigured so it will list first 1000 object stored in it.To see it we can use this command.
```bash
aws s3 ls s3://demo-bucket.redseclabs.com/ --no-sign-request --region us-east-1
```

To access its data we will use this commnand.
```bash
aws s3 sync s3://demo-bucket.redseclabs.com/. --region us-east-1 --no-sign-request
```

![[Screenshot_2025-07-22_04-17-06 3.png]]

![[Screenshot_2025-07-22_04-17-06 4.png]]

Access Control Lists (ACLs) and bucket policies are mechanisms to manage access to S3 bucket resources. Misconfiguration in these settings can unintentionally grant read or write access to unauthorized users.
When attempting to access the bucket anonymously, an “Access denied” error is returned, which generally indicates that the bucket is private.

```bash
aws s3 sync s3://demo-bucket.redseclabs.com/. --region us-east-1 --no-sign-request
```

![[Screenshot_2025-07-22_04-17-06 5.png]]

Due to the misconfiguration that allows anyone with an AWS account to access the contents of the bucket, let’s see how we can accomplish this using the AWS CLI.
To access the bucket, we need to authenticate via AWS CLI by configuring an AWS access key ID and secret access key. By doing so, you associate them with the AWS CLI on your machine. The CLI will then use these credentials to authenticate your API requests to AWS services. These details can be retrieved from AWS Management [Console](https://us-east-1.con-sole.aws.amazon.com/iamv2/home?region=us-east-1#/security_credentials/access-key-wizard).
To configure both keys, we will use the configure command. This command will prompt you for the AWS access key, secret key, and the default region for authentication.
```bash
aws configure
```

![[Screenshot_2025-07-22_04-17-06 6.png]]

```bash
aws s3 ls s3://demo-bucket.redseclabs.com/ --region us-east-1
```

![[Screenshot_2025-07-22_04-17-06 7.png]]
Copy file from aws S3 bucket
```bash
aws s3 cp s3://demo-bucket.redseclabs.com/file  local_path --no-sign-request
```

Upload the file on aws S3 bucket
```bash
aws s3 cp file s3://demo-bucket.redseclabs.com/ --no-sign-request
```

Download the data from bucket
```
aws --endpoint-url https://sgp1.digitaloceanspaces.com s3 cp s3://webassets/ ./webassets/ --recursive --no-sign-request 
```