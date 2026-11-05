The macOS filesystem can be looked at through several lenses. The structure mimics a standard Unix/Linux setup but also has its own context for User, Local, and System directories. 
## MacOS Domains

![Diagram of file system domains: Local Domain with Applications, Developer, Library, Utilities; System Domain with System, Library; User Domain with Users, User_1, User_2, Shared.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/D3.png)

In macOS, a file system is divided into multiple domains that separate files and resources. Domains apply `access privilege` to the files and resources in that domain, preventing unauthorized users from changing files.

| **Domain**       | **Description**                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Local Domain`   | Contains resources such as apps that are local to the current computer and shared among all computer users.                                |
| `System Domain`  | Contains the system software installed by Apple.                                                                                           |
| `User Domain`    | Contains resources specific to the users who log in to the system. This domain reflects the home directory of the current user at runtime. |
| `Network Domain` | Contains resources such as apps and documents that are shared among users of a local area network.                                         |
## macOS File System Structure

![Diagram of Mac File Hierarchy with Standard Directories: Applications, System, Users, Library, Network, Volumes; and Unix Specific Directories: bin, dev, etc, sbin, tmp, usr, var, private, opt, cores, home.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/D1.png)

### Standard Directories

#### /Applications
The `Applications` directory contains applications that users would commonly use.

|**Domain**|**Description**|
|---|---|
|`User Domain`|Applications that are installed and related to a particular user are saved under `/Users/username/Applications`|
|`Local Domain`|Applications which are installed by a user, installed by `Apple`, and which can be used by `all` users present in a computer are saved under `/Applications`|
|`System Domain`|Applications which are related to the system or installed by `Apple` are saved under `/System/Applications`|

#### /Users
The `Users` directory belongs to the `User Domain`. It contains user-related applications, files, and resources.
#### /Library
The `Library` directory stores custom data files for applications, caches, configurations, resources, preferences, and user data. The Local and system domain Library directories are Global in scope, while the user Library directory is specific to that user.

|**Domain**|**Description**|
|---|---|
|`User Domain`|Information about the applications related to the current user is stored in `/Users/username/Library`|
|`Local Domain`|Information related to an application that is shared by all the users who are using that application is stored in `/Library` directory|
|`System Domain`|Information about system applications is stored in `/System/Library`|

The `Library` directory contains some key subdirectories:

- `Library/Application Support`: Contains app-specific support files, data files & configuration files
- `Library/Caches`: Contains app-specific support files that the app can re-create easily
- `Library/Frameworks`: Stores libraries that are used, or needed, to create an application
- `Library/Preferences`: contains the application preferences (Power Management, Software Update, Logging, Calendar, etc.)

#### /Network
The `Network` directory contains files that belong to the network domain. This directory contains the list of computers in the local area network.

#### /System
The `System` directory contains the system resources required by macOS to run. These files are installed by Apple and shouldn't be modified.

### Unix-Specific Directories
macOS also has some Unix-specific directories structured in a tree-like hierarchy.

#### Directory Tree

![Diagram of Unix Specific Directories: bin, dev, etc, sbin, tmp, usr, var, private, opt, cores, home.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/D2.png)

|**Directory**|**Description**|
|---|---|
|`/`|Is the root filesystem and contains everything the operating system needs to complete the boot cycle. Any volumes or filesystems can be found here. Think of `/` as our bucket containing everything the host needs and storing them in subdirectories like `/etc`, `/home`, and `/usr`.|
|`/bin`|Is our main storage point for binaries.|
|`/dev`|Maintains our device-id files that enable the use of hardware devices attached to the system.|
|`/etc`|`/etc` contains our system and application configuration files.|
|`/sbin`|Contains all the essential and common administrative binaries we need to keep our systems running smoothly.|
|`/tmp`|The `/tmp` directory is used by the operating system to store temporary files that do not need to be persistent. The files in this directory are wiped away at each reboot.|
|`/usr`|This is one of the largest directories on our host. It contains all of the libraries we may need, applications such as FTP, SSH, and even vim.|
|`/var`|This Is where we store our system log files, sources for our web servers, backups, and more.|
|`/private`|Stores critical system files and caches required to operate. They are hidden in the /Private directory to ensure the standard user does not modify them.|
|`/opt`|This is our storage point for any third-party applications or packages we install.|
|`/cores`|Contains Core Dumps stored by MacOS that are intended for developers to troubleshoot any issues that arise.|
|`/home`|Each user on the system has a subdirectory here for storage. Our user Desktop, Downloads, and Documents folders can be found here.|

This was not an exhaustive list of every directory or subdirectory on our hosts. We recommend if you run into a specific folder you do not quite understand the purpose of, check the man page or Google what that specific directory is for. The `man hier` command is also helpful for getting an initial understanding of the standard Unix folder structure.

---

Now that we have an idea of how our macOS host filesystem is structured let's look at file and directory permissions so we understand who can access what files within the filesystem.

### View Root Directory
One way to view the `root` directory is to launch the `Finder` app from the Dock, click on the `Go` Pane at the top, select `Computer` & click on `Storage`.![Mac Finder window with 'Go' menu open, highlighting 'Computer' option.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/visit_root_directory.png)![Mac Finder window showing folders: Applications, Library, System, Users.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/org_files.png)

Another way to open the root directory is to launch the `Finder` app from Dock; enter the keyboard shortcut `Command + Shift + G`, type `/`, and hit `Go`.![Mac Finder window with 'Go to the folder' dialog box open.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/visit_root_directory_2.png)
You may also go up and down directories in Finder using the `Command` with the `up` and `down` arrows.
### View Hidden Files and Folders
There are lots of hidden files and folders present on macOS that prevent users from accidentally deleting files used by the operating system. However, there are multiple ways to view hidden files on a Mac using the GUI and terminal.

To view hidden files and folders using the GUI:

1. Open the folder where you want to see hidden files

![Mac Finder window showing folders: Applications, Library, System, Users.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/org_files.png)

2. Hold down `Command + Shift + .` (full stop/period)

![Mac Finder window showing folders and files: .file, .vol, .VolumeIcon.icns, Applications, Library, System, Users, bin, cores, etc, home, opt, sbin, tmp, usr, var, Volumes.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/finder_hidden_files.png)

You may also change the default view of Finder to show hidden files, as follows:

1. Open a terminal from `Dock` & run the following commands in Terminal

        shellsession
`[root@htb]/Users$ defaults write com.apple.Finder AppleShowAllFiles true [root@htb]/Users$ killall Finder`

---

## Using Preview Pane

The `Preview Pane` within `Finder` allows us to glance at what files and images look like before opening them. It provides instant previews of what’s in each file you highlight with additional information about the file such as `Creation Date & Time`, `Last Modified Date & Time`, `Last Opened Date & Time`, etc.

Enable `Preview Pane` inside `Finder` to look at the file preview.

1. Launch the `Finder` app from the Dock.
2. Click on the `View` Pane at the top & select `Show Preview`.![Mac Finder window with 'View' menu open, highlighting 'Show Preview' option.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/Show_Preview-2.png)
3. Now, you can click on any file and see the file's contents on the right side with additional information regarding the file.![Mac Finder window showing 'image.jpeg' selected with a preview on the right.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/preview_pane-2.png)

#### Split View
By using Split View, you can split your Mac screen between two apps. It would automatically resize the screen without manually moving and resizing windows.
![Browser window with options: Enter Full Screen, Tile Window to Left, Tile Window to Right.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/1_split_view.png)
Choose `Tile Window to Left of Screen` from the menu, and the window will fill that side of the screen.
![Split screen showing Google homepage on the left and Notes app with 'No Notes' on the right.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/2_split_view.png)
