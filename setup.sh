#!/bin/sh

# Don't commit these files, but keep them in the repo as templates.
git update-index --skip-worktree \
	backend/src/main/resources/application.properties \
	frontend/.env

# Install and/or update frontend dependencies.
cd frontend
npm install

echo Setup complete!
