/**
 * IndexedDB
 * 
 * add
 * put
 * get
 * delete
 * 
 * created by leeing on 2018/3/7
 */
class IndexedDB {
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
    this.request = indexedDB.open(this.options.dbName, this.options.version)
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