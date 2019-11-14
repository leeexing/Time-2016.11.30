/**
 * 多tip碰撞
*/

/**
 * 检测用户标记嫌疑框正确与否
 * @param {用户标记框坐标} r1 [307, 344, 347, 375]
 * @param {嫌疑物图像中所在位置} r2 [300, 400, 500, 606]
 * @return boolean
 */
function intersectRectArray(r1, r2) {

  var X1 = Math.min(r1[0], r1[2]);
  var W1 = Math.abs(r1[0] - r1[2]);
  var Y1 = Math.min(r1[1], r1[3]);
  var H1 = Math.abs(r1[1] - r1[3]);

  var X2 = Math.min(r2[0], r2[2]);
  var W2 = Math.abs(r2[0] - r2[2]);
  var Y2 = Math.min(r2[1], r2[3]);
  var H2 = Math.abs(r2[1] - r2[3]);

  var centerMX = X1 + W1 / 2;
  var centerMY = Y1 + H1 / 2;

  var centerX = X2 + W2 / 2;
  var centerY = Y2 + H2 / 2;

  // - 相离
  if (X1 + W1 < X2 || X2 + W2 < X1 || Y1 + H1 < Y2 || Y2 + H2 < Y1) {
    return false;
  } else {
    // -相交
    var WW = Math.min(W1, W2, X1 + W1 - X2, X2 + W2 - X1);
    var HH = Math.min(H1, H2, Y1 + H1 - Y2, Y2 + H2 - Y1);

    var insectArea = WW * HH;
    var markArea = W1 * H1;


    var tipArea = W2 * H2;
    var ratioOfA = insectArea / markArea; // -相交区域与用户选择区域的占比
    var ratioOfB = insectArea / tipArea; // -相交区域与嫌疑物区域的占比

    console.log(insectArea, markArea, tipArea, '==', ratioOfA, ratioOfB)

    // -判断权重系数
    var judgeWightOfA = 0.4; // user mark 权重
    var judgeWightOfB = 0.2; // tip 占比 权重
    // var judgeWightOfA = 0.5; // user mark 权重
    // var judgeWightOfB = 0.4; // tip 占比 权重
    var isCneterInMark = X1 < centerX && (X1 + W1) > centerX && Y1 < centerY && (Y1 + H1) > centerY; // tip中心是否在用户标记框
    var centersDistance = Math.sqrt((centerX - centerMX) * (centerX - centerMX) + (centerY - centerMY) * (centerY - centerMY)); // tip嫌疑框和mark标记框中心点之间的距离

    tipArea < 0.02 && (judgeWightOfA -= 0.1); // -tip  面积越小，权重适当降低
    tipArea < 0.01 && (judgeWightOfA -= 0.1);
    tipArea < 0.005 && (judgeWightOfA -= 0.1);

    isCneterInMark && (judgeWightOfB -= 0.1); // mark包含tip中心点，权重继续降低

    // -user 包含 tip
    if (X1 < X2 && X1 + W1 > X2 + W2 && Y1 < Y2 && Y1 + H1 > Y2 + H2) {
      return ratioOfA > (judgeWightOfA + 0.1) ? true : false; // 外包情况要求严格一点
    }
    // -tip 包含 user
    else if (X2 < X1 && X2 + W2 > X1 + W1 && Y2 < Y1 && Y2 + H2 > Y1 + H1) {
      centersDistance < 0.15 && (judgeWightOfB -= 0.03);
      centersDistance < 0.03 && (judgeWightOfB -= 0.02); // `user mark中心点`和`tip中心点`离得很近
      centersDistance < 0.01 && (judgeWightOfB -= 0.01); // 离得十分近
      return ratioOfB > judgeWightOfB ? true : false;
    }
    // -tip 相交 user
    if (ratioOfA > judgeWightOfA) {
      return ratioOfB > judgeWightOfB ? true : false;
    }
    return false;
  }
}

/**
 * 判断用户画框的结果
 * 判断策略：
 * 提前退出：一个标记框对应一个tip嫌疑框。如果用户标记框小于tip嫌疑框，直接返回false
 * ✅不提前退出：一个标记框可以对应多个tip。标记框 是否[大于等于] tip嫌疑物；如果小于，则需要[每个]标记框和[所有]tip框；排除：一个标记框同时标记正确两个tip嫌疑框的情况
 * @param {用户标记嫌疑框的坐标数组} signBoxes
 */
function apiOfJudgeTipResult(userSignBoxes) {
  const tipBoxes = [[140, 110, 276, 186], [179, 144, 326, 219]]
  let result = false
  let lenOfUserSignBoxes = userSignBoxes.length
  let lenOfTipBoxes = tipBoxes.length

  let signBoxesRet = []
  let tipBoxesRet = new Array(lenOfTipBoxes).fill(false)
  for (let i = 0; i < lenOfUserSignBoxes; i++) {
    let isSignBoxHitTarget = false
    console.log('i', i)
    for (let j = 0; j < lenOfTipBoxes; j++) {
      console.log('j', j)
      let checkRet = intersectRectArray(userSignBoxes[i], tipBoxes[j])
      console.log('ret', checkRet)
      if (checkRet) {
        isSignBoxHitTarget = checkRet
        tipBoxesRet[j] = checkRet
        // if (checkRet) {
        //   console.log('退出tip嫌疑框遍历')
        //   break
        // }
      }
    }
    signBoxesRet.push(isSignBoxHitTarget)
  }
  console.log(signBoxesRet, tipBoxesRet)

  // 正确依据：[所有]]tip都被标记正确，以及，[所有]signBox都命中嫌疑框, 就算用户多标记，只要都标记对就返回 true
  result = tipBoxesRet.every(item => item) && signBoxesRet.every(item => item)
  return result
}

let ret = apiOfJudgeTipResult([[165, 133, 336, 228], [272, 188, 400, 250]])
// let ret = apiOfJudgeTipResult([[156, 90, 243, 201], [272, 188, 400, 250]])
// let ret = apiOfJudgeTipResult([[158, 123, 298, 203], [272, 188, 400, 250]])
// let ret = apiOfJudgeTipResult([[158, 123, 298, 203], [156, 90, 243, 201]])
// let ret = apiOfJudgeTipResult([[158, 123, 298, 203]])
console.log('最终判图结果：', ret)
