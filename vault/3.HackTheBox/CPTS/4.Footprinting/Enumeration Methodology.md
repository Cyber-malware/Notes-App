Enumeration is a widely used term in cyber security. It stands for information gathering using active (scans) and passive (use of third-party providers) methods. But OSINT is separate  which is passive info-gathering.

This methodology is nested in 6 layers to pass with the enumeration process but whole  process is divide into 3 levels.

| `Infrastructure-based enumeration` | `Host-based enumeration` | `OS-based enumeration` |
| ---------------------------------- | ------------------------ | ---------------------- |
![](Pasted%20image%2020250702000556.png)

first and second layer (Internet Presence, Gateway) does not quite apply to the intranet, such as an Active Directory infrastructure
![[Screenshot_2025-06-29_10_22_28 3.png]]

After Pentest company in few weeks we can not say its fully secure because gaps always be there.

***Layer No.1: Internet Presence***
The first layer we have to pass is the "Internet Presence" layer, where we focus on finding
the targets. If it allow to scan more hosts so it will be more critical.
The goal of this layer is to identify all possible target systems and interfaces that can be tested.

**Layer No.2: Gateway**
we try to understand the interface of the reachable target, how it is protected, and
where it is located in the network.
The goal is to understand what we are dealing with and what we have to watch
out for.

**Layer No.3: Accessible Services**
Every service that installed has purpose that can open new door for us.
This layer aims to understand the reason and functionality of the target system and gain the necessary knowledge to communicate with it and exploit it for our purposes effectively

**Layer No.4: Processes**
Every time a command or function is executed bu user or data create a process. These task  have at least one source and one target.
The goal here is to understand these factors and identify the dependencies
between them.

**Layer No.5: Privileges**
Each service runs through specific user in particular group with permissions and privileges defined by administrator or the system.These  provide us with functions that administrators overlook and  happens in Active Directory infrastructures and many other case.
It imp to identify these and understand what is and is not possible with these privileges.

**Layer No.6: OS Setup**
we collect info about operating system and its setup using internal access.This gives us good overview of the internal security of the systems and reflects the skills and capabilities of the company's administrative teams.
The goal here is to see how the administrators manage the systems and what
sensitive internal information we can glean from them.

