
- **GUI**: [Aqua](https://en.wikipedia.org/wiki/Aqua_\(user_interface\)#References) is the basis for the Graphical interface and visual theme for macOS.
- **File Manager**: [Finder](https://support.apple.com/en-us/HT201732) is the component of macOS that provides the Desktop experience and File management functions within the OS. Aqua also responsible for launching other applications.
- **Application Sandbox**: By default, macOS and any apps within it utilize the concept of sandboxing, which restricts the application's access outside of the resources necessary for it to run.

[Cocoa](https://developer.apple.com/library/archive/documentation/macOSX/Conceptual/OSX_Technology_Overview/CocoaApplicationLayer/CocoaApplicationLayer.html): Cocoa is the application management layer and API used with macOS. It is responsible for the behavior of many built-in applications within macOS.

MacOS is built on **Darwin**, an open-source Unix-like operating system developed by Apple. Darwin contains:

- The **XNU kernel** (which combines the Mach microkernel with BSD components)
- A large amount of code derived from FreeBSD and other BSD projects
- Unix user-space utilities and networking components

|**Component**|**Description**|
|---|---|
|`Apple Menu`|This is our main point of reference for critical host operations such as System Settings, locking our screen, shutting down the host, etc.|
|`Finder`|Finder is the component of macOS that provides the Desktop experience and File management functions within the OS.|
|`Spotlight`|Spotlight serves as a helper of sorts on your system. It can search the filesystem and your iCloud, perform mathematical conversions, and more.|
|`Dock`|The Dock at the bottom of your screen, by default, acts as the holder for any apps you frequently use and where your currently open apps will appear.|
|`Launchpad`|This is the application menu where you can search for and launch applications.|
|`Control Center`|Control Center is where we can manage our network settings, sound and display options, notification, and more at a glance.|
## Apple Menu
![Mac Finder menu with options: About This Mac, System Settings, App Store, Force Quit Finder, Sleep, Restart, Shut Down, Lock Screen.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/apple-menu.jpg)

From this menu, we can perform quick admin functions such as shutting down/restarting the host or accessing System Settings.
## Spotlight
![Mac desktop with Spotlight search for '.png' files, showing results and an 'Example' folder on the desktop.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/gui-spotlight.png)

`Spotlight` provides an indexing and searching service on your host. It can search for documents, media, emails, applications, and anything else on your local system and in connected cloud services like iCloud.
## Dock
![Mac dock with icons for Finder, Launchpad, Safari, Reminders, Podcasts, System Preferences, Skitch, Visual Studio Code, Chrome, Microsoft Remote Desktop, Slack, Terminal, and Hack The Box.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/Dock.jpg)

The `Dock` provides a customizable place to store applications and folder shortcuts for us to access them when needed quickly.

## Finder
![Mac Finder window showing 'Desktop' with an 'Example' folder, highlighted Finder icon in the dock.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/Finder.jpg)

`Finder` is the macOS file manager through which we can manage and access our files. It provides:

- The initial desktop experience.
- File management.
- The menu bar at the top of your desktop.
- The sidebars within your windows.
## Launchpad
![Mac Launchpad showing apps like App Store, Safari, Mail, Contacts, Calendar, and more, with Launchpad icon highlighted in the dock.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/Launchpad.jpg)

`Launchpad` provides users with a quick way to access, organize, and launch applications. Any apps installed on the host in the Applications directory will appear here.
## Control Center
![Mac control center showing Wi-Fi, Bluetooth, AirDrop, Focus, Stage Manager, Screen Mirroring, Display, Sound, and Music controls.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/157/Control-Center.jpg)

`Control Center` allows quick access to settings we commonly tweak, such as our audio volume, screen brightness, wireless connection settings, and other settings.

