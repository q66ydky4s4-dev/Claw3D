# Harness Engineering instructions

## Purpose

This directory contains a portable, versioned operating system for AI-assisted
software engineering. It is designed to be launched by Hermes and consumed by
Codex or ChatGPT Work.

## Instruction order

1. System and platform safety rules.
2. Explicit user request.
3. The nearest `AGENTS.md` from the working directory upward.
4. The selected agent, workflow, prompt, and checklist.
5. Templates and examples.

If instructions conflict at the same level, stop only when the conflict changes
the requested outcome or requires new authority. Otherwise choose the safer,
smaller, reversible action and record the assumption.

## Required operating loop

1. Read the nearest instructions and inspect relevant files.
2. State the intended outcome and acceptance criteria.
3. Select one primary agent and one workflow; add specialist reviewers only when
   the risk or scope justifies them.
4. Make focused changes and preserve unrelated user work.
5. Run checks proportional to risk.
6. Report changed files, decisions, checks, residual risks, and next action.

## Boundaries

- Treat `../sources/` as read-only.
- Never expose secrets or place credentials in prompts, logs, or fixtures.
- Never claim a check passed unless it was executed successfully.
- Never publish, deploy, merge, spend money, or contact third parties unless the
  user explicitly authorized that action.
- Prefer repository-native tools and preserve the current architecture.
- Do not modify generated or vendored files unless the task requires it.

## Completion contract

A task is complete when its acceptance criteria are met, relevant checks pass,
documentation is updated when behavior changed, and remaining risks are stated.
