@echo off

@rem Don't commit these files, but keep them in the repo as templates.
git update-index --skip-worktree ^
	backend/src/main/resources/application.properties ^
	frontend/.env

@rem Install and/or update frontend dependencies.
pushd frontend
call npm install
popd

echo Setup complete!
