#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git add ./

git commit -m 'docs: 更新文章'

echo "开始推送代码到远程仓库"

git push

echo "推送成功！"

cd -
