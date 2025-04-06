# Github Workflow

This project follows a **Trunk-Based** Development workflow to ensure fast iteration, smooth collaboration, and maintainable code quality. All changes go through a strict review process before being merged into the main codebase.

### Table of Contents

[Start w/ Tickets](#start-w-tickets)
[Branch Naming Convention](#branch-naming-conventions)
[Push Your Changes](#push-your-changes)
[Pulling Changes to Your Branch](#pulling-changes-to-your-branch)
[Branch Behind? Rebase It!](#branch-behind-rebase-it)
[Still on Main?](#still-on-main)
[Merge to Main (Admin Only)](#merge-to-main-admin-only)
[Commit Message Guidelines](#commit-message-guidelines)
[Merging Strategy](#merging-strategy)

---

## Start w/ Tickets

All tasks should begin from a connected ticket on our project board.

```
git checkout -b <type/short-description> main
```

Go to the **CRAMS Project Board**
Locate your assigned ticket
Scroll to the right sidebar under **Development**
Connect your branch to the ticket

---

## Branch Naming Convention

Branches should follow the **Conventional Commits** style using the commit `type` as a prefix:

### Format:

```
<type>/short-description
```

### Examples:

`feat/add-user-authentication`
`fix/fix-login-bug`
`chore/update-dependencies`
`docs/update-readme`
`test/improve-coverage`

### Allowed Types:

`feat` → New feature
`fix` → Bug fix
`chore` → Maintenance tasks
`docs` → Documentation updates
`test` → Test-related changes
`refactor` → Code improvements (no functional changes)
`style` → Code styling (formatting, linting, etc.)
`perf` → Performance improvements
`build` → Changes that affect the build system

---

## Push Your Changes

_Please refer to [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) for the format of your commit messages_

**Always run format before committing:**

```
npm run format
```

Then proceed with:

```
git add .
git commit -m “feat: your message here”
git push origin <current branch name>
```

Open a Pull Request (PR) to the `main` branch
Move the corresponding ticket to the **For Review** column
If you encounter errors while pushing:

```
git push origin <current branch name> --force
```

---

## Pulling Changes to Your Branch

When others have merged into `main`, pull the latest changes to stay up-to-date:

```
git pull origin main
```

After pulling:

```
npm install
```

> Run `npm install` in case there are new packages added by others

---

## Branch Behind? Rebase It!

If your local branch is behind `main`, **rebase before pushing** to avoid merge conflicts later.

```
git fetch origin main
git rebase origin/main
```

> If rebase fails or conflicts, stash your changes:

```
git stash
git fetch origin main
git rebase origin/main
git stash pop
```

Don’t forget to resolve any merge conflicts during this step.

---

## Still on Main?

Always branch off from `main`. Do not push changes directly.

```
git checkout -b <type/short-description> main
```

> Already made changes in `main`? **Do this:**

```
git stash
git checkout -b CR-<ticket-number> main
git stash pop
```

---

## Commit Message Guidelines

We follow **Conventional Commits** for all messages.

### Format:

```
<type>(<scope>): <message>

[optional body]

[optional footer]
```

### Examples:

`feat(auth): add user authentication`
`fix(login): resolve incorrect password issue`
`chore(deps): update dependencies`
`docs(readme): update usage instructions`

**Scope** is optional, but recommended for clarity.

---

## Merge to Main (Admin Only)

Only admins are allowed to merge into `main`.
Do **not** click the default “Merge” button.
Use the dropdown beside the merge button.
Select **Rebase and merge** to keep history clean.
After merge **delete the branch to keep the repo clean.**
Move the ticket to **Done** after merge.

---

## One Ticket, One Branch

Stick to a **1 ticket = 1 branch** rule to make tracking and reviews easier. Never reuse branches across tickets.

> **If you're unsure about any step, ask your project manager or lead! We're all learning—no shame in asking.**
