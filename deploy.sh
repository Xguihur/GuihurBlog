#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# git init 不需要重新创建，直接 commit 和 push 即可
echo "正在提交 commit 到本地"
git init
git add ./
git commit -m 'deploy'

# 因为在 dist 文件夹中，所以 -f 强行推送没毛病
# 如果发布到 https://<USERNAME>.github.io/<REPO>
echo "正在推送到远程仓库：https://github.com/Xguihur/GuihurBlog.git master:gh-pages"
git push -f https://github.com/Xguihur/GuihurBlog.git master:gh-pages

cd -