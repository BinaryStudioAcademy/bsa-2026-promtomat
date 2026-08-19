#!/bin/sh
# Seeds gitignored environment files into a newly created worktree.
#
# `git worktree add` materialises tracked files only, so a fresh worktree has no
# .env files and the apps refuse to start. Git runs post-checkout with an
# all-zero previous HEAD whenever a checkout creates a new working tree, which is
# the signal used here — every other checkout returns immediately, so switching
# branches stays instant.

NULL_REF="0000000000000000000000000000000000000000"

[ "$1" = "$NULL_REF" ] || exit 0

# The first entry of `git worktree list` is always the main working tree.
main_worktree=$(git worktree list --porcelain | head -n 1 | cut -d " " -f 2-)
current_worktree=$(git rev-parse --show-toplevel)

[ -n "$main_worktree" ] || exit 0
[ "$main_worktree" != "$current_worktree" ] || exit 0

# Ask git which ignored files exist instead of hard-coding a list, so a new app
# is picked up automatically. --directory collapses fully ignored folders such
# as node_modules into a single entry, which the filter then drops.
env_files=$(git -C "$main_worktree" ls-files --others --ignored --exclude-standard --directory |
	grep -E '(^|/)\.env(\..+)?$')

if [ -z "$env_files" ]; then
	echo "[post-checkout] no env files in $main_worktree, create them from the .env.example files"
	exit 0
fi

echo "$env_files" | while IFS= read -r env_file; do
	if [ -f "$current_worktree/$env_file" ]; then
		continue
	fi

	mkdir -p "$current_worktree/$(dirname "$env_file")"
	cp "$main_worktree/$env_file" "$current_worktree/$env_file"
	echo "[post-checkout] seeded $env_file"
done
