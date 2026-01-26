#!/bin/bash

issues=$(gh issue list --state open --json number,title,body,comments)

opencode run --agent build "Here are the open issues: $issues

Follow the instructions in specs/prompt.md for task breakdown, selection, and execution."
