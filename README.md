# GitHub User Activity CLI

A command-line tool that fetches and displays the recent public activity of any GitHub user.

## Requirements
- Node.js 18 or higher

## Usage
```bash
node index.js <username>
```

Example:
```bash
node index.js torvalds
```

## Sample output
```
Recent activity of torvalds:

- Pushed 3 commits to torvalds/linux
- Starred some-user/some-repo
```

## Optional: install as a command
```bash
npm link
github-activity torvalds
```

## How it works
Sends a request to `https://api.github.com/users/<username>/events`, parses the JSON response and prints a readable line for each event.

Project idea from [roadmap.sh](https://roadmap.sh/projects/github-user-activity).