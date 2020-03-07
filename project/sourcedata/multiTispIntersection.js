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

    var tipArea = W2 * H2;
    var markArea = W1 * H1;
    var insectArea = WW * HH;

    var ratioOfA = insectArea / markArea; // -相交区域与用户选择区域的占比
    var ratioOfB = insectArea / tipArea; // -相交区域与嫌疑物区域的占比

    // -判断权重系数
    var judgeWeightOfA = 0.4; // user mark 权重
    var judgeWeightOfB = 0.25; // tip 占比 权重

    var isCneterPointInMark = X1 < centerX && (X1 + W1) > centerX && Y1 < centerY && (Y1 + H1) > centerY; // tip中心是否在用户标记框
    var centersDistance = Math.sqrt((centerX - centerMX) ** 2 + (centerY - centerMY) ** 2); // tip嫌疑框和mark标记框中心点之间的距离

    // * tip  面积越小，权重适当降低
    tipArea < 4900 && (judgeWeightOfA -= 0.03);
    tipArea < 3600 && (judgeWeightOfA -= 0.05);
    tipArea < 3600 && (judgeWeightOfA -= 0.05);
    tipArea < 2500 && (judgeWeightOfA -= 0.05);
    tipArea < 1600 && (judgeWeightOfA -= 0.1);
    tipArea < 900 && (judgeWeightOfA -= 0.1);

    // * tip 和 user mark 中心点的位置越小，权重越低
    isCneterPointInMark && (judgeWeightOfB -= 0.1); // mark包含tip中心点，权重继续降低
    centersDistance < 30 && (judgeWeightOfB -= 0.01);
    centersDistance < 20 && (judgeWeightOfB -= 0.02);
    centersDistance < 10 && (judgeWeightOfB -= 0.03);

    console.log(insectArea, markArea, tipArea, '==', ratioOfA, ratioOfB, centersDistance)

    // -user 包含 tip; 外包含情况要求严格一点
    if (X1 < X2 && X1 + W1 > X2 + W2 && Y1 < Y2 && Y1 + H1 > Y2 + H2) {
      return ratioOfA > (judgeWeightOfA + 0.1) ? true : false;
    }
    // -tip 包含 user; 两个中心点离得远近，权重越低
    else if (X2 < X1 && X2 + W2 > X1 + W1 && Y2 < Y1 && Y2 + H2 > Y1 + H1) {
      console.log('【ratioOfB】', ratioOfB, '【judgeWeightOfB】', judgeWeightOfB)
      return ratioOfB > judgeWeightOfB ? true : false;
    }
    // -tip 相交 user
    console.log(ratioOfA, '-', judgeWeightOfA, '= B', ratioOfB, '+', judgeWeightOfB)
    if (ratioOfA > judgeWeightOfA) {
      return ratioOfB > judgeWeightOfB ? true : false;
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
  const tipBoxes = [[140, 110, 276, 186], [376, 288, 533, 391]]
  let result = false
  let lenOfUserSignBoxes = userSignBoxes.length
  let lenOfTipBoxes = tipBoxes.length

  let signBoxesRet = []
  let tipBoxesRet = new Array(lenOfTipBoxes).fill(false)
  for (let i = 0; i < lenOfUserSignBoxes; i++) {
    let isSignBoxHitTarget = false
    // console.log('i', i)
    for (let j = 0; j < lenOfTipBoxes; j++) {
      // console.log('j', j)
      let checkRet = intersectRectArray(userSignBoxes[i], tipBoxes[j])
      // console.log('ret', checkRet)
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

let ret = apiOfJudgeTipResult([[212, 154, 292, 198], [272, 188, 400, 250]])
// let ret = apiOfJudgeTipResult([[156, 90, 243, 201], [272, 188, 400, 250]])
console.log('最终判图结果：', ret)
