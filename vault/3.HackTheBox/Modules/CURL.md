The cURL command (client URL) is a powerful tool used for transferring data to and from servers and support protocols like HTTP, HTTPS, FTP, and SMTP. This flexibility makes it highly effective for tasks like **API testing**, downloading files, and interacting with web servers directly.

```
curl [options] [URL]
```

- **–help** – prints the cURL command manual and options. 
- **-O** – downloads the original file from the given URL. 
- **-L** – follows the redirection URLs.
- **-I** – fetches only the header.
- **-d** – submits form data. 
- **-F** – uploads complex data or files. 
- **-X** – specifies the method for transferring data.

send  request to multiple site , saving output and downloading data
```
curl https://www.example1.com https://example2.com
curl https://www.google.com > file1.txt
curl -O http://www.example.com/path/file.zip
```

to follow redirect , max redirect and fetch header
```
curl -L http://www.googlr.com
curl -L --max-redirs 3 http://www.googlr.com
curl -I http://www.google.com
```

Adding username, Header and submitting data also through key_value pair file
```
curl -u username:password <URL>
curl -H "Authorization: ApiKey <API key>" <URL>
curl -X POST -d "username=johndoe&password=secret" https://example.com/login
curl -X POST -d @data.txt https://example.com/login
```

Uploading file also multiple files
```
curl -F "file=@test.txt" https://example.com/upload
curl -F "file=@/path/to/image.jpg" -F "file=@/path/to/image2.jpg" https://example.com/upload
```

Upload through ftp even for secure protocol
```
curl -T /path/to/file ftp://ftp.example.com/remote/path/
curl -u username:password -T /path/to/file sftp://sftp.example.com/remote/path/
```

Custom header, define content type and API custom header
```
curl -X POST -H "Content-Type: application/json" -d '{"form":"JSONdata"}' https://api.example.com/
curl -H "Accept: application/json" https://api.example.com/data
curl -H "X-API-Version: 2" https://api.example.com/v2/data
```

Depending on the endpoint, you might need to use different protocols with cURL. For example, you might want to use SFTP to transfer files while testing a mailing server requires SMTP.To run cURL using different protocols, simply specify it at the beginning of your endpoint’s URL before **://**.
```
curl --url smtp://smtp.example.com --mail-from "user@example.com" --mail-rcpt "recipient@example.com" -T email.txt
```