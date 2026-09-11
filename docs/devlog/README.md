# Devlog

One file per calendar day, `YYYY-MM-DD.md`, aimed at a non-technical stakeholder — what happened,
when, and why it mattered.

**Generated from git and GitHub, not from memory.** Each regeneration rewrites the day from the
authoritative source, so several sessions in one day consolidate correctly and nothing depends on
what a previous session happened to remember. That is also why work sitting uncommitted in a
working tree is invisible here.

**Not append-only, but history.** Today's file gets rewritten freely; earlier days are left alone,
and a correction to a past day is recorded in a *later* day's entry rather than by editing the
original.

**An entry describes the project's day, not a branch's work.** The sibling repository enforces
that by committing devlog entries on `master` only; here everything goes through a pull request,
so an entry travels in one like anything else. The constraint that matters is the scope of the
writing, not the route it takes: never narrow an entry to whatever branch happens to carry it.

## Shape

```
# YYYY-MM-DD — <a narrative title, not a label>

**Source**: <n> commits, `sha`–`sha` (HH:MM–HH:MM); pull requests [#n](url).

<A lede that says what actually changed for the project.>

## <Narrative heading, not "Changes">
...

## Commits today
```
<git log --oneline output>
```
```

Headings are narrative. "The day began by discovering the destination was wrong" tells a reader
something; "Documentation updates" does not.

## Why this repository has one at all

The first version of `AGENTS.md` argued against it: the sibling repository keeps a devlog because
a non-technical stakeholder tracks a months-long build, and a one-page marketing site looked like
it would not justify the ceremony.

That was wrong in a way worth recording. Two days in, this project had already accumulated
decisions a stakeholder would want to follow — which host and why, what a public repository
exposes, a domain that turned out to be registered somewhere that constrained the DNS plan — and
none of it was legible without reading commit messages. The devlog was adopted on 2026-09-11 on
the project owner's call, and `AGENTS.md` was corrected rather than left contradicting the
directory next to it.

## Generating an entry

```bash
git log --since='YYYY-MM-DD 00:00' --until='YYYY-MM-DD 23:59' \
        --date=format:'%H:%M' --format='%ad %h %s'
gh pr list --state merged --search 'merged:YYYY-MM-DD' --json number,title,url
```

Read the diffs, not just the subjects — a commit subject says what changed, and the entry has to
say why it mattered.
