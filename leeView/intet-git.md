# 探寻Git

## git rebase

rebase在git中是一个非常有魅力的命令，使用得当会极大提高自己的工作效率；相反，如果乱用，会给团队中其他人带来麻烦。它的作用简要概括为：可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用rebase命令可以使我们的提交历史干净、简洁！

1. git rebase -i [startpoint] [endpoint]
2. git rebase

## git log

1. git log -2
2. git log -2 --oneline
3. git log --graph
4. git log --grep keywords
5. git log --author yourname
6. git log -p -- RELEASE-NOTE.md

通过组合使用--auther、--grep、-p这几个参数，几乎能满足大部分检索需求了。

## git reset

1. git reset --soft HEAD
2. git reset --mixed
3. git reset --hard


## git diff

1. git diff
2. git diff --cache
3. git diff --HEAD