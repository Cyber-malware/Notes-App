`Claude` is a family of proprietary large language models (LLMs) and an AI assistant developed by Anthropic.

`Slash /`  is kind of shortcut you type inside the `claude` code session starting with `/` that trigger specific predefined action or workflow.

A session is conversation with claude code everything from when you run to when you type `/exit`. It has unique `id` with full history and saved automatically in `~/.claude/projects/`.

```best_practices
one session = one task
Name your session
commmit frequently within session
use /btw for quick question
export the imp session befor big refactor       
```

A `context` window is amount of information in tokens that a model like claude code can see and remember at one time while generating response. It has context window has approx  `200k` tokens.

### Models
Anthropic provide 3 types of models.

`Opus` Most powerful and expensive used for complex programming tasks.
`Sonnet` Default for most users and best balance of speed, quality and tokens cost. God for daily coding task.
`Haiku` Fastest and cheapest used for simple and repetitive task where you don't ned deep reasoning.

![[Pasted image 202606040829354.PNG]]

### Commands
There are multiple commands in claude code.
`/usage`
`/permissions`
`/stats`
`/config`

To allow command in `permissions` to claude
`Bash(git init)`
### Context Window
Amount of information in tokens that a model like `claude` code can see and remember at one time while generating response. 

![[context.PNG]]

Token consumed both by user `query` and claude `response`.
![[tokens.PNG]]

Give separate session to every new feature you are adding otherwise it will use lot of tokens. 

Subagents get their own isolated context window completely separate from main session. Subagents provide the summary to main agent after task completed.

![[claude_tokes.PNG]]

`/context` check the usage percentage of token usage.
`/compact`  compact the entire conversation and generate the summary of whole conversation. Use only when you are not in imp feature development.
`/clear`  start from beginning in same session and new session start a new session.

```best_practices
One session per feature
use /compact when needed 
write focused specific prompts
Use subagents for isolated or exploratory work
use .claudeignore file to keep irrelevant files out 
```

| Command               | Description                                                   | Usage Example                                                           | Tips / Best Practices / Notes                                                                                   |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/rewind`             | Rewind conversation or code changes                           | `Esc+Esc` to show menu. Choose to rewind code only or conversation only | Auto-checkpoints (saved on every prompt) make this great for experimental edits. Saves tokens in long sessions. |
| `/insights`           | Generate an HTML report analyzing your usage patterns         | `/insights` saves report to `~/.claude/usage-data/report.html`          | The report suggests Skills and Hooks to optimize your workflow.                                                 |
| `/help`               | Show list of available commands                               | `/help`                                                                 | A starting point for discovering hidden features.                                                               |
| `/context`            | Display context usage (token consumption visualization)       | `/context`                                                              | Prevents token overflow in long conversations. Combine with `/compact` to keep output short.                    |
| `/compact`            | Switch responses to concise mode                              | `/compact` or `/compact focus on errors`                                | Saves tokens. Specifying error focus improves debugging efficiency                                              |
| `/init`               | Initialize a new project (creates CLAUDE.md, etc.)            | `/init`                                                                 | Use at project start. Combine with custom templates                                                             |
| `/usage`              | Show plan usage and rate limit status                         | `/usage`                                                                | Monitor limits on free plan. Though I don't see many people using the free plan                                 |
| `/clear`              | Clear conversation                                            | `/clear`                                                                | Reset context for new tasks.                                                                                    |
| `/agents`             | Sub-agent management                                          | `/agents`                                                               | Parallel processing for complex tasks. The hot topic right now.                                                 |
| `/install-github-app` | Install GitHub App (automate PR reviews)                      | `/install-github-app`                                                   | Integrate into CI/CD workflows. Boost productivity with automated PR comments.                                  |
| `/cost`               | Show token usage statistics                                   | `/cost`                                                                 | Track costs per session. `/usage` is for your overall plan, while this is per-session.                          |
| `/export`             | Export current conversation to file or clipboard              | `/export conversation.md`                                               | For saving and sharing useful exchanges. Not used often, but good to know                                       |
| `/review`             | Request code review                                           | `/review`                                                               | For when I'm paranoid about whether my code is garbage. Self-review before PRs.                                 |
| `/pr_comments`        | Display PR comments                                           | `/pr_comments`                                                          | Requires GitHub integration. For checking comments.                                                             |
| `/doctor`             | Environment diagnostics (detect dependency and config issues) | `/doctor`                                                               | Same as a human health checkup. First stop for troubleshooting                                                  |


 

