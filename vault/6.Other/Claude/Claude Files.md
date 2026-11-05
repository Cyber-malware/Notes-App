
LLMs do not have memory. Need to repeat instructions across sessions. so we use claude.md file to tell the model previous instructions.

### Writing file
we have two ways to write  `claude.md` file.
- writing the file manually 
- using `/init`  trigger an internal agent that take over the scanning and writing task. It scan high signal config files first and read directory structure then focus on tech stack folder layout and naming conventions.
![[init.PNG]]

- `Project context` Short description of the project.
- `Architecture` Explain how code base is structure and where things belong.
- `Code stryle` Tell claude how code should look like and what convention follow. 
- `Prefer libraries` what tools or framework should be used.
- `Commands` List exact commands for running, testing and maintaining the project.
- `Critical rules` Highlights critical warnings, edge cases and things to avoid.
### Types of Claude Directory
It has two places one in project and other in user.
- `.claude`  directory contain subagents, commands, skills and rules.
- `.claude` directory in `~` directory contain same things including the folder with name of project and all sessions of project saved
### Types of Claude files
#### Local
- `CLAUDE.md` file in project root directory or in `.claude` directory in project folder.
- `claude.local.md` in your project root directory read alongside `claude.md` and automatically git ignore so your personal tweaks never land in repo.
#### Global
`~/.claude/.CLAUDE.md` your personal preferences that apply across all projects like coding style or preferred tools etc.
#### Subdirectory
`./folder/CLAUDE.md` create file in any folder of project that contain information of that folder in big projects.

```best_practices
start with /init then remove unnecessary files
commit it to git
only put applicable things that fit for that feature
use important in front of line if its much imp for project.
```

`claude.md` files should not be bigger then 200 lines. if increase so split into multiple files and create topic files in `rules` section. You can create `claude.md` files in subdirectories.
### Auto Memory
A file `MEMORY.md` where claude record learning, patterns, and insights as it works like user calculate prices in `pkr` not in `$`. It lives in `~/claude/projects/project/memory/`. It loads only first 200 lines. 
Claude write this files or you can also add this by using prompt and instructing to work in `MEMORY.md` files.

`/memory` command used for different memory options.


