
## Slash
In `claude` we can create custom slash `/` commands to perform specific tasks.
It has two types of scopes.
- `project scope` stored in `.claude/commands/` available only within project.
- `User scope` stored in `~/.claude/commands/` available across all projects.

`Slash` commands link to files and these files can be create manually or using `AI` that contain description, allowed tools and some details about task that `claude` perform when run command.

```note
Now `claude` merge the commands and skills. Commands now will created same as skills and trigger by user but skills automatically trigger by model when required. 
```
## Skills
Skills are reusable file based resources that provide `claude` with domain specific expertise that transform general purpose agents into specialists. 
![[skill_structure.png]]

`skill.md` file contain primary two things `YAML` frontmatter and `Markdown` body. 
`/skils` in claude code help to create `skills.md` file.

![[skills.png]]

Steps to create a skill
```
Create dir and write skill.md file
Add supporting files 
Test the skills
Iterate and refine
```

we can create `skill.md` using `Ai` by providing the data or we can use `claude skill marketplace` [sites](https://skillsmp.com/creators/obra/superpowers/skills-brainstorming) to download free pre-written skill files.

Add a flag in `skill.md` file `disable-model-invocation:true` if we want model do not trigger this file automatically. 

## SubAgents
Specialized Ai assistants that run in their own isolated context windows doing heavy lifting in a separate space and handling back only what matters.

#### Advantages of `subagents`
- Use less `tokens` and every agent have separate `context window`.
```note
Modularity
Context isolation
Specialization
Parallelism
```
#### Top uses
```
Code based exploration
Independent code review
Verification and validation
Multi-stage pipelines (input of one output for other)
Parallel independent task
Security Audit
```

### Types of Subagents
- Built in subagents
```
Explore (explore the code)
Plan (implementation plan)
General purpose subagent (read/write)
```

`Claude` code automatically call the subagent or we can also `manually` call the subagent for specific task.

- Custom subagents
```
User level subagents
Project level subagents
```

`User` level agent contain tools, permissions, prompt and models excess etc.

![[custom_subagents.png]]

If we want to perform specific task according to out rules and regulations so `custom` subagents are preferred.
![[subagent_man.png]]

![[subagent_Desc.png]]
We can create `custom-agent.md` file manually or using `claude` and saved in `.claude/agent/custom-agent`. They also trigger automatically or manually.




