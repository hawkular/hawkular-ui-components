#!/usr/bin/env bash
#execute this only when pull requesting to master, or pushing to master
export GH_BRANCH=gh-pages
# run this only if branch is master and we are not in pull request
if [ "$TRAVIS_BRANCH" = "master" ] && [ $TRAVIS_PULL_REQUEST = "false" ]; then
        set -e
        rm -rf "../${GH_BRANCH}"
        git clone -b ${GH_BRANCH} "https://${GH_REF}.git" "../${GH_BRANCH}"

        cp ./dist/* "../${GH_BRANCH}" -rf 2>/dev/null || :
        cd "../${GH_BRANCH}"

        git add .
        git config user.name "Travis CI"
        git config user.email "<your@email.com>"
        git commit -m "Deploy to GitHub Pages"

        git push --force --quiet "https://${GH_TOKEN}@${GH_REF}.git"
fi
