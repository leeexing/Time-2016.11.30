# ceph

## 重启指令

```js
// linux重新挂载指令
mount -o acl,nfsvers=3  10.14.32.148:/ceph-training   /ceph-training
```

## ceph试用集群信息

1、**windows客户端10.15.225.23**
访问地址为： 10.14.32.148
目录为 ceph148-2T-ceph-training
用户名： peixunzu     密码： ceph@nuc
使用方法：已经通过映射网络驱动器方式，映射为Z盘

2、 **linux客户端 10.15.225.23**
访问地址为：10.14.32.148:/ceph-training
认证方式：导出时已制定IP段为10.15
试用方法： 已经通过nfsv3挂载为    /ceph-training       （linux通过nfsv3挂载，v3支持递归集成父目录权限,这样便于windows和linux同时共享访问 ）
