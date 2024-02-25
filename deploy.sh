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
# git push -f https://github.com/Xguihur/GuihurBlog.git master:gh-pages
git push -f git@github.com:Xguihur/GuihurBlog.git master:gh-pages # 使用 ssh 推送终于成功了，为什么 https 无法成功呢？这是一个需要去研究的问题
# git push -f https://Xguihur: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@github.com/Xguihur/GuihurBlog.git master:blog

cd -