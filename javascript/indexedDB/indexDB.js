/**
 * 分离出来的数据查询
 */
class DBQuery {
  constructor() {
      this.init()
  }
  init() {
      console.groupCollapsed('你想知道什么')
      console.log('姓名：李星')
      console.log('职业：web前端工程师')
      console.log('爱好：篮球、户外、摄影')
      console.log('个人网站：http://www.leexing.com/')
      console.groupEnd()

      this.dbHelper = DB_INSTANCE
  }
  getData_CT(imgInfo, callback) {
      let that = this
      console.log('CT_ID',imgInfo.storageID)
      this.dbHelper.get_by_key(imgInfo.storageID).then(db_data => {
          // 本地还没有保存过这条 fileID 的数据
          if (!db_data) {
              console.log(`%c CT数据远程下载 & 本地存储 ... `, 'background:#c41d7f;color:#fff')
              this.fetchData_CT(imgInfo.ct).then(data => {
                  console.log(data)
                  let insertData = {
                      FileID: imgInfo.storageID,
                      ImgData: data[0],
                      ImgDesData: data[1],
                      SuspectCubeData: data[2],
                      Density: data[3]
                  }
                  this.dbHelper.insert(insertData)
                  callback(data)
              })
          } else {
              // 没有 CT 相关的数据存储，需要 update 这条 fileID 的数据
              if (!db_data.ImgData) {
                  console.log(`%c CT数据本地更新 ... `, 'background:#eb2f96;color:#fff')
                  this.fetchData_CT(imgInfo.ct).then(data => {
                      console.log(data)
                      db_data.ImgData = data[0]
                      db_data.ImgDesData = data[1]
                      db_data.SuspectCubeData = data[2]
                      db_data.Density = data[3]
                      this.dbHelper.update(db_data)
                      callback(data)
                  })
              } else {
                  console.log(db_data)
                  let {ImgData, ImgDesData, SuspectCubeData, Density} = db_data
                  console.log(`%c CT数据本地读取 ... `, 'background:#f759ab;color:#fff')
                  callback([ImgData, ImgDesData, SuspectCubeData, Density])
              }
          }
      })
  }
  getData_DR(imgInfo, callback) {
      let that = this
      console.log('DR_ID', imgInfo.storageID)
      this.dbHelper.get_by_key(imgInfo.storageID).then(db_data => {
          // 本地还没有保存过这条 fileID 的数据
          if (!db_data) {
              console.log(`%c DR数据远程下载 & 本地存储 ... `, 'background:#c41d7f;color:#fff')
              this.fetchData_DR(imgInfo.dr).then(data => {
                  console.log(data)
                  let insertData = {
                      FileID: imgInfo.storageID,
                      Angle1: data[0],
                      Suspect1: data[1],
                      Angle2: data[2] || null,
                      Suspect2: data[3] || null
                  }
                  this.dbHelper.insert(insertData)
                  callback(data)
              })
          } else {
              // 没有 DR 相关的数据存储，需要 update 这条 fileID 的数据
              if (!db_data.Angle1) {
                  console.log(`%c DR数据本地更新 ... `, 'background:#eb2f96;color:#fff')
                  this.fetchData_DR(imgInfo.dr).then(data => {
                      console.log(data)
                      db_data.Angle1 = data[0]
                      db_data.Suspect1 = data[1]
                      db_data.Angle2 = data[2] || null
                      db_data.Suspect2 = data[3] || null
                      this.dbHelper.update(db_data)
                      callback(data)
                  })
              } else {
                  console.log(db_data)
                  let {Angle1, Suspect1, Angle2, Suspect2} = db_data
                  console.log(`%c DR数据本地读取 ... `, 'background:#f759ab;color:#fff')
                  callback([Angle1, Suspect1, Angle2, Suspect2])
              }
          }
      })
  }
  getData_DR_2(fileID) {
      this.dbHelper.get_by_key(fileID).then(data => {
          console.log(data)
      })
  }
  // 视角主体数据
  fetchData_CT(ctObj) {
      let fetchDataFns = []
      Object.keys(ctObj).map(key => ctObj[key]).forEach(item => {
          if (item.suspect !== '') {
          if (item.endsWith('.txt')) {
              fetchDataFns.push(this.loadDataByFileReaderTxt(item))
          } else {
              fetchDataFns.push(this.loadDataByFileReader(item))
          }
          } else {
          fetchDataFns.push(this.loadEmptyData())
          }
      })
      return new Promise((resolve, reject) => {
          Promise.all(fetchDataFns)
          .then(data => {
              resolve(data)
          })
          .catch(error => {
              reject(error)
          })
      })
  }
  fetchData_DR(drArr) {
      let fetchDataFns = []
      // 视角主体数据
      drArr.forEach(item => {
        fetchDataFns.push(this.loadDataByFileReader(item.url))
        if (item.suspect !== '') {
          fetchDataFns.push(this.loadDataByFileReader(item.suspect))
        } else {
          fetchDataFns.push(this.loadEmptyData())
        }
      })
      return new Promise((resolve, reject) => {
        Promise.all(fetchDataFns)
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
  }
  // 下载 png 图像信息
  loadDataByFileReader(url) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        let xhr = new XMLHttpRequest()

        xhr.open('get', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function () {
          if (this.status === 200) {
            reader.readAsDataURL(this.response)
          } else {
            console.log(this.statusText)
          }
        }
        xhr.setRequestHeader('If-Modified-Since','0')
        xhr.send(null)
        reader.onerror = error => {
          reject(error)
        }
        reader.onload = data => {
          resolve(data.target.result)
        }
      })
  }
  // 下载 txt 文件信息
  loadDataByFileReaderTxt(url) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        let xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function () {
            if (this.status === 200) {
                reader.readAsText(this.response)
            } else {
                console.log(this.statusText)
            }
        }
        xhr.setRequestHeader('If-Modified-Since','0')
        xhr.send(null)
        reader.onerror = error => {
          reject(error)
        }
        reader.onload = data => {
          resolve(data.target.result)
        }
      })
  }
  // 当 suspect='' 时，直接返回 null 数据
  loadEmptyData() {
      return new Promise(resolve => {
        resolve(null)
      })
  }
}

/**
 * IndexedDB
 * 第二版
 * created by leeing on 2018/4/28
 */
class IndexedDB {
  constructor(options={}) {
    this.options = {
      version: 1,
      dbName: 'NSTS',
      tableName: 'imgIndexDB',
      createIndexName: ['FileID']
    }
    Object.assign(this.options, options)
    this.init()
  }
  init() {
    this.tableName = this.options.tableName
    this.request = window.indexedDB.open(this.options.dbName, this.options.version)
    this.request.onupgradeneeded = event => {
      console.log('%c 数据库创建或者版本更新 ', 'backround:#f5222d;color:#fff;')
      let db = event.target.result
      let objectStore = db.createObjectStore(this.tableName, {KeyPath: 'FileID'})
      if (this.options.createIndexName) {
        this.options.createIndexName.forEach((name, index) => {
          objectStore.createIndex(name, name, {unique: index === 0})
        })
      }
    }
    this.request.onsuccess = event => {
      console.log('%c 数据库建立成功 ', 'background:#13c2c2;color:#fff;')
      this.db = event.target.result
    }
    this.request.onerror = event => {
      console.log('数据库建立失败')
      console.log("Why didn't you allow my web app to use IndexedDB?!")
    }
  }
  insert(data) {
    return new Promise((resolve, reject) => {
      let store = this.db.transaction(this.tableName, 'readwrite')
                      .objectStore(this.tableName)
      let req = store.add(data, data.FileID)
      req.onsuccess = function() {
        console.log(`%c ${data.FileID} 数据存储 `, 'background:#52c41a;color:#fff;')
        resolve(this.result)
      }
      req.onerror = function() {
        reject(this.result)
      }
    })
  }
  insert_many(data) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(data)) {
        reject('data must be array')
      }
      let store = this.db.transaction(this.tableName, 'readwrite')
                      .objectStore(this.tableName)
      data.forEach(item => {
        let req = store.add(item, item.FileID)
        req.onsuccess = function() {
          resolve(this.result)
        }
        req.onerror = function() {
          console.log(this)
          reject(this.result)
        }
      })
    })
  }
  update(data) {
    return new Promise((resolve, reject) => {
      let store = this.db.transaction(this.tableName, 'readwrite')
                      .objectStore(this.tableName)
      let req = store.put(data, data.FileID)
      req.onsuccess = function() {
        console.log(`%c ${data.FileID} 数据更新 `, 'background:#722ed1;color:#fff;')
        resolve(this.result)
      }
      req.onerror = function() {
        reject(this.result)
      }
    })
  }
  get_by_key(key) {
    return new Promise((resolve, reject) => {
      if (!key) {
        resolve(null)
      }
      let store = this.db.transaction(this.tableName, 'readwrite')
                      .objectStore(this.tableName)
      let req = store.get(key)
      req.onsuccess = function() {
        resolve(this.result)
      }
      req.onerror = function() {
        reject(this.result)
      }
    })
  }
  get_by_index(value, indexName='name') {
    if (!value) {
      console.error('索引不能为空')
      return Promise.reject('索引不能为空!!!')
    }
    if (!this.options.createIndexName.includes(indexName)) {
      console.error('没有这个索引')
      return Promise.reject('没有这个indexName!!!')
    }
    let store = this.db.transaction(this.tableName, 'readwrite')
                    .objectStore(this.tableName)
    let index = store.index(indexName)
    return new Promise((resolve, reject) => {
      let req = index.get(value)
      req.onsuccess = e => {
      resolve(e.target.result)
      }
      req.onerror = e => {
      reject(e.target)
      }
    })
  }
  get_all(value, indexName='name') {
    if (!value) {
      console.error('索引不能为空')
      return Promise.reject('索引不能为空!!!')
    }
    if (!this.options.createIndexName.includes(indexName)) {
      console.error('没有这个索引')
      return Promise.reject('没有这个indexName!!!')
    }

    let store = this.db.transaction(this.tableName, 'readwrite')
                    .objectStore(this.tableName)
    let index = store.index(indexName)
    return new Promise((resolve, reject) => {
      let req = index.getAll(value)
      req.onsuccess = e => {
      resolve(e.target.result)
      }
      req.onerror = e => {
      reject(e.target)
      }
    })
  }
  get_by_range(startKey, endKey) {
    return new Promise((resolve, reject) => {
      let store = this.db.transaction(this.tableName, 'readwrite')
                  .objectStore(this.tableName)
      let index = store.index(indexName)
      const singleKeyRange = IDBKeyRange.only(startKey) // key === startKey
      const lowerBoundKeyRange = IDBKeyRange.lowerBound(startKey) // key <= startKey
      const lowerBoundOpenKeyRange = IDBKeyRange.lowerBound(startKey, true) // key < startKey
      const upperBoundOpenKeyRange = IDBKeyRange.upperBound(startKey, true)
      const boundKeyRange = IDBKeyRange.bound(startKey, endKey, false, true)
      index.openCursor(boundKeyRange).onsuccess = e => {
        let cursor = e.target.result
        if (cursor) {
          // Do something with the matches
          cursor.continue()
        }
      }
    })
  }
  delete(key) {
    if (!key) {
      return
    }
    let store = this.db.transaction(this.tableName, 'readwrite')
                    .objectStore(this.tableName)
    store.delete(key)
  }

}
// 项目中提前初始化
const DB_INSTANCE = new IndexedDB()


/**
 * IndexedDB
 * 
 * created by leeing on 2018/3/7
 */
class IndexedDB_ {
  constructor(options={}) {
    this.options = {
      version: 1,
      dbName: 'leeing',
      tableName: 'indexedDB',
      createIndexName: null
    }
    Object.assign(this.options, options)
    this.init()
  }
  init() {
    this.request = window.indexedDB.open(this.options.dbName, this.options.version)
    this.request.onupgradeneeded = event => {
      console.log('数据库创建或者版本更新')
      let db = event.target.result
      let objectStore = db.createObjectStore(this.options.tableName, {KeyPath: 'id'})
      if (this.options.createIndexName && Array.isArray(this.options.createIndexName)) {
        this.options.createIndexName.forEach((name, index) => {
          objectStore.createIndex(name, name, {unique: index === 0})
        })
      }
    }
    this.request.onsuccess = event => {
      console.log('数据库建立成功')
      this.db = event.target.result
      // this.tx = this.db.transaction(this.options.tableName, 'readwrite')
      // this.store = this.tx.objectStore(this.options.tableName)
    }
    this.request.onerror = event => {
      console.log('数据库建立失败')
      console.log("Why didn't you allow my web app to use IndexedDB?!")
    }
  }
  add(data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('the DB is not initialized')
      }
      if (!Array.isArray(data)) {
        reject('data must be array')
      }
      let tx = this.db.transaction(this.options.tableName, 'readwrite')
      let store = tx.objectStore(this.options.tableName)
  
      data.forEach(item => {
        // console.log(item)
        let req = store.add(item, item.id)
        req.onsuccess = function() {
          resolve(this.result)
        }
        req.onerror = function() {
          reject(this.result)
        }
      })
    })
  }
  get_by_key(key) {
    return new Promise((resolve, reject) => {
      if (!key) {
        resolve(null)
      }
      let tx = this.db.transaction(this.options.tableName, 'readwrite')
      let store = tx.objectStore(this.options.tableName)
  
      let req = store.get(key)
      req.onsuccess = function() {
        resolve(this.result)
      }
      req.onerror = function() {
        reject(this.result)
      }
    })
  }
  get_by_index(value, indexName = 'name') {
    if (!value) {
      console.error('索引不能为空')
      return Promise.reject('索引不能为空!!!')
    }
    if (!this.options.createIndexName.includes(indexName)) {
      console.error('没有这个索引')
      return Promise.reject('没有这个indexName!!!')
    }
    let tx = this.db.transaction(this.options.tableName, 'readwrite')
    let store = tx.objectStore(this.options.tableName)
    let index = store.index(indexName)
    return new Promise((resolve, reject) => {
      let req = index.get(value)
      req.onsuccess = e => {
        resolve(e.target.result)
      }
      req.onerror = e => {
        reject(e.target)
      }
    })
  }
  get_all(value, indexName='name') {
    if (!value) {
      console.error('索引不能为空')
      return Promise.reject('索引不能为空!!!')
    }
    if (!this.options.createIndexName.includes(indexName)) {
      console.error('没有这个索引')
      return Promise.reject('没有这个indexName!!!')
    }

    let tx = this.db.transaction(this.options.tableName, 'readwrite')
    let store = tx.objectStore(this.options.tableName)
    let index = store.index(indexName)
    return new Promise((resolve, reject) => {
      let req = index.getAll(value)
      req.onsuccess = e => {
        resolve(e.target.result)
      }
      req.onerror = e => {
        reject(e.target)
      }
    })
  }
  get_by_range() {
    return new Promise((resolve, reject) => {
      let tx = this.db.transaction(this.options.tableName, 'readwrite')
      let store = tx.objectStore(this.options.tableName)
      let index = store.index(indexName)
    })
  }
  delete(key) {
    if (!key) {
      return
    }
    let tx = this.db.transaction(this.options.tableName, 'readwrite')
    let store = tx.objectStore(this.options.tableName)
    store.delete(key)
  }
}