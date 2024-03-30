# 确保脚本抛出遇到的错误
set -e

echo "开始推送分支"
# 生成静态文件
git add ./
git commit -m 'deploy: 更新博客'
git push 

echo "推送成功"

cd -