#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 因为在 dist 文件夹中，所以 -f 强行推送没毛病
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/Xguihur/GuihurBlog.git master:gh-pages

cd -