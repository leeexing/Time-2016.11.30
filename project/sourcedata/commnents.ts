/**
 * 评论模块数据库设计
*/

// -评论下的回复ID
interface CommentIDArr {
  [index: number]: String;
}

// -评论数据集合（优先入库）
interface IComments {
  id: String;
  title: String;
  userId: String;
  replys: CommentIDArr;
  likeNum: Number;
  createTime: Date;
}

// -模块下评论（其次）
interface IModuleComment {
  id: String;
  moduleId: String; // *模块唯一id。（课件、考试等）
  comments: CommentIDArr;
  createTime: Date;
  modifyTime: Date;
}

// -用户个人评论数据集合（最后）
interface IComment_$userID {
  id: String;
  title: String;
  userId: String;
  replys: CommentIDArr;
  likeNum: Number;
  createTime: Date;
}

// -点赞数据库表
interface ILike {
  id: String;
  userId: String; // 建立索引
  commentId: String; // 建立索引
  createTime: Date;
  modifyTime: Date;
}

// -举报类型枚举
enum ReportType {
  Marketing, // 营销广告
  Obscenity, // 淫秽色情
  MoreCruel, // 恶意谩骂
  IllegalInfo, // 违法信息
  FalseRumors, // 虚假谣言
  NotWannaSee, // 不想看到
}

// -举报数据库表
interface IReport {
  id: String;
  userId: String;
  commentId: String;
  type: ReportType; // -根据举报类型确定是否需要填写必要文字
  content: String;
  createTime: Date;
}

enum EventType {}

// -事件记录表
interface IEvents {
  id: String;
  type: String;
  createTime: Date;
}