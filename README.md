# The Official Team Sparkle Motion Repository 🎉

## Getting started

1. Go through all the [preliminaries](#preliminaries).

2. Clone this repository

   ```bash
   git clone git@github.com:TeamSparkleMotion/TeamSparkleMotion.git
   ```

3. Run the appropriate setup script.

   - Windows: [`setup.bat`](/setup.bat)
   - Linux: [`./setup.sh`](/setup.sh)

4. Change [.env](/frontend/.env) in your clone to reflect the device you are running the project on.

5. If port 8082 isn't available on your machine:

   - Change `server.port` in [application.properties](/backend/src/main/resources/application.properties) to an available port.
   - Change `API_BASE_URL` in [apiConfig.js](/frontend/apiConfig.js) to use the same port.


## Running the app

1. Run this command in the [frontend](/frontend/) directory:

   ```bash
    npm start
   ```

## Preliminaries

1. An ssh key is required\* to clone this repository. [Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) or use an ssh key on your machine that's connected to your GitHub account with access to this repository.

2. Ensure you have nvm installed (the Node version manager).

   - [Windows](https://github.com/coreybutler/nvm-windows/)
   - [Linux](https://github.com/nvm-sh/nvm/)

3. Ensure you have your IDEs of choice, e.g. VSCode and IntelliJ IDEA.

   - [VSCode](https://code.visualstudio.com/download)
   - [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
      - NOTE: The first download button is a 30-day trial for the paid version.
        Scroll down a little for the Community Edition.
      - Set it up by following the second video in the `Backend Setup` discord thread.

## Contributing to the Project

This section describes the workflow for contributing to the project using Git and GitHub. It assumes you have a basic understanding of Git commands and concepts.

### Branching

When working on a new feature, bug fix, or improvement, create a new branch from the `devleopment` branch. This allows you to work on your changes independently without affecting the main codebase.

To create a new branch, use the following command:

```
git checkout development
git checkout -b feature/your-feature-name
```

Replace `your-feature-name` with a descriptive name for your feature or change.

### Committing

As you make changes to the codebase, commit your changes locally to track your progress. It's a good practice to make small, focused commits with descriptive messages.

To stage your changes for a commit, use:

```
git add file1 file2
```

Avoid adding your entire directory with `git add .`.

To commit the staged changes, use:

```
git commit -m "Your commit message"
```

Example commit messages:
- "Add new feature for user authentication"
- "Fix bug in search functionality"
- "Refactor database connection code"

### Pushing

After committing your changes locally, push your branch to the remote repository on GitHub. This allows others to see your changes and collaborate with you. Push frequently (as often as after every commit) to avoid losing any work.

To push a new branch for the first time:

```
git push -u origin feature/your-feature-name
```

After your first push on a new branch, use:

```
git push
```

### Making Pull Requests (PRs)

When you have completed your feature or change and want to merge it into the main branch, create a pull request on GitHub.

1. Go to the repository on GitHub: https://github.com/BruceCosgrove/TeamSparkleMotion
2. Click on the "Pull requests" tab.
3. Click on the "New pull request" button.
4. Select your branch as the "compare" branch and the `development` branch as the "base" branch.
5. Provide a descriptive title and description for your pull request, explaining the changes you made and any relevant information.
6. Assign any relevant team members to review. If multiple people need to review, make sure to mention it in your description.
7. Click on the "Create pull request" button.
8. Post a link for the PR, along with its title, in the Pull Requests discord channel.

When creating a pull request, please provide a detailed description that includes:

- A clear and concise title that summarizes the purpose of the pull request.
- A thorough explanation of the changes made and the problem they solve or the feature they introduce.
- Step-by-step instructions on how to test the changes.
- Screenshots or GIFs demonstrating the changes, if applicable.
- Any relevant issue numbers or references to related pull requests.

Here's a template for the pull requests description:

```
## Description
[Provide a detailed description of the changes made in this pull request. Explain the problem it solves or the feature it introduces.]

## How to Test
[Provide step-by-step instructions on how to test the changes made in this pull request. Include any necessary setup or configuration.]

1. [Step 1]
2. [Step 2]

## Screenshots/GIFs
[If applicable, include screenshots or GIFs demonstrating the changes.]

## Related Issues
[If applicable, list any related issue numbers or references to related pull requests.]

- Closes #[issue number]
- Related to #[issue number]
```

### Reviewing Pull Requests

Unless stated otherwise, a PR only needs to be reviewed by one of the people assigned to it before merging. The approver can merge the PR immediately after approving.

Before approving, make sure to:
1. Read all changes in all files.
2. Check for adequate testing of new changes.
3. Follow the testing instructions included in the README.

If the PR does not meet the standards necessary to merge, leave a comment clearly outlining all necessary changes / additions. You can make small changes (spelling fixes, formatting mistakes, etc.) yourself - if you contribute to a larger change, the PR will require an additional reviewer.
