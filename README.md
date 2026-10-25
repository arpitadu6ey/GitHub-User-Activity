# GitHub User Activity CLI

A command-line tool that fetches and displays the recent public activity of any GitHub user.

## Usage
```bash
node index.js <username>
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
