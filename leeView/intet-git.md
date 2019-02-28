# 探寻Git

## git branch

git branch -v 查看当前领先多少

## git rebase

> 前提：不要通过rebase对任何已经提交到公共仓库中的commit进行修改（你自己一个人玩的分支除外）

rebase在git中是一个非常有魅力的命令，使用得当会极大提高自己的工作效率；相反，如果乱用，会给团队中其他人带来麻烦。它的作用简要概括为：可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用rebase命令可以使我们的提交历史干净、简洁！

1. git rebase -i [startpoint] [endpoint]
2. git rebase -p
3. git cherry-pick
    * git cherry-pick 6bbf6b4 #将commit6bbf6b4 应用到dev02上
4. git rebase master dev -- 相当于在 dev 分支上 git rebase master。将dev分支上 变基到 master 的最新 commit
    随后到master上，执行`git merge`就产生一个fast-forward。这样就只产生一个提交点，没有交叉提交历史
5. git rebase --onto A B C  --! 这个不好用。可以放弃了
    rebase --onto的机制是左开右闭
    也就是说，如果你真的想要B的这一个节点切片，你应该从B之前的一个分支开始

**rebase黄金定律**
永远不要rebase一个已经分享的分支（到非remote分支，比如rebase到master,develop,release分支上），也就是说永远不要rebase一个已经在中央库中存在的分支.只能rebase你自己使用的私有分支

* 只要你的分支上需要rebase的所有commits历史还没有被push过(比如上例中rebase时从分叉处开始有两个commit历史会被重写)，就可以安全地使用git rebase来操作。
    对于不再有子分支的branch，并且因为rebase而会被重写的commits都还没有push分享过，可以比较安全地做rebase

快速sum up： 核心工作流原则和心法

* 当我需要merge一个临时的本地branch时。。。我确保这个branch不会在版本变更历史图谱中显示，我总是使用一个fast-forward merge策略来merge这类branch，而这往往需要在merge之前做一个rebase;
* 当我需要merge一个项目组都知道的local branch时。。。我得确保这个branch的信息会在历史图谱中一直展示，我总是执行一个true merge
* 当我准备push我的本地工作时。。。我得首先清理我的本地历史信息以便我总是push一些清晰易读有用的功能；
* 当我的push由于和别人已经发布的工作相冲突而被拒绝时，我总是rebase更新到最新的remote branch以避免用一些无意义的micro-merge来污染历史图谱

## git show

git show 查看提交的详情
git show commitId 查看指定commit hashID的所有修改
git show commitId fileName 查看某次commit中具体某个文件的修改

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