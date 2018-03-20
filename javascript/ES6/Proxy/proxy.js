/**
 * proxy的一些使用场景
 * 
 * 代理还是非常激动的，因为它们是一个用来调节访问JS应用程序里面对象的简洁语义化的构造
 * 
 * 代理就跟中间件有很多相同点
 * 
 * 代理让你可以拦截通常在一个对象或者其属性上调用的许多的方法, 最常见的就是 get, set, apply (针对函数) 以及 construct (对于函数而言就是用 new 这个关键词)。
 */

// 1、基本使用
let dataStore = {
  name: 'leeing',
  age: 23
}
let handler = {
  get(target, key, proxy) { // 也做 （target, key, receiver）, 一般就是 this 的绑定对象
    const today = new Date()
    console.log(`Get request made for ${key} at ${today}`)
    return Reflect.get(target, key, proxy)
  }
}
dataStore = new Proxy(dataStore, handler)
const name = dataStore.name


// 2、抽离验证类的代码
// 功能：它被用来确保数据存储中所有的属性都是相同的类型
let numericDataStore = {
  count: 0,
  amount: 1234,
  total: 14
}
numericDataStore = new Proxy(numericDataStore, {
  set(target, key, value, proxy) {
    if (typeof value !== 'number') {
      throw Error('properties in numericDataStore can only be numbers')
    }
    return Reflect.set(target, key, value, proxy)
  }
})
// this will throw an error
numericDataStore.count = 'foo'
numericDataStore.count = 333
// 这很有趣，但是你会有多频繁的使用类型完全相同的属性来创建对象呢?


// Define a validator that takes custom validators and returns a proxy
function createValidator(target, validator) {  
  return new Proxy(target, {
    _validator: validator,
    set(target, key, value, proxy) {
      if (target.hasOwnProperty(key)) {
        let validator = this._validator[key];
        if (!!validator(value)) {
          return Reflect.set(target, key, value, proxy);
        } else {
          throw Error(`Cannot set ${key} to ${value}. Invalid.`);
        }
      } else {
        // prevent setting a property that isn't explicitly defined in the validator
        throw Error(`${key} is not a valid property`)
      }
    }
  });
}
// Now, just define validators for each property
const personValidators = {  
  name(val) {
    return typeof val === 'string';
  },
  age(val) {
    return typeof age === 'number' && age > 18;
  }
}
class Person {  
  constructor(name, age) {
    this.name = name;
    this.age = age;
    return createValidator(this, personValidators);
  }
}
const bill = new Person('Bill', 25);
// all of these throw an error
bill.name = 0;  
bill.age = 'Bill';  
bill.age = 15;


// 3、在 JavaScript中实现真正的私有
var api = {  
  _apiKey: '123abc456def',
  /* mock methods that use this._apiKey */
  getUsers: function(){ }, 
  getUser: function(userId){ }, 
  setUser: function(userId, config){ }
};
// Add other restricted properties to this array
const RESTRICTED = ['_apiKey'];
api = new Proxy(api, {  
    get(target, key, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} is restricted. Please see api documentation for further info.`);
        }
        return Reflect.get(target, key, proxy);
    },
    set(target, key, value, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} is restricted. Please see api documentation for further info.`);
        }
        return Reflect.set(target, key, value, proxy);
    },
    // or
    has(target, key) {
      return (RESTRICTED.indexOf(key) > -1) ?
        false :
        Reflect.has(target, key);
    }
});


// throws an error
console.log(api._apiKey);
// throws an error
api._apiKey = '987654321';



// 4、静默地对象访问日志
// 基本的一点是，任何时候你要调用一个方法，首先都得获得这个方法。所以如果你想要拦截一次方法调用，就需要拦截这个方法的获取过程，然后才能拦截它的使用过程。
api = new Proxy(api, {  
  get: function(target, key, proxy) {
    var value = target[key];
    return function(...arguments) {
      logMethodAsync(new Date(), key);
      return Reflect.apply(value, target, arguments);
    };
  }
});
function logMethodAsync(timestamp, method) {  
  setTimeout(function() {
    console.log(`${timestamp} - Logging ${method} request asynchronously.`);
  }, 0)
}

// executes apply trap in the background
api.getUsers();



// 5、提供警告信息或者阻止特定操作的执行
let dataObj = {  
  noDelete: 1235,
  oldMethod: function() {/*...*/ },
  doNotChange: "tried and true"
};
const NODELETE = ['noDelete'];  
const DEPRECATED = ['oldMethod'];  
const NOCHANGE = ['doNotChange'];
dataObj = new Proxy(dataObj, {  
  set(target, key, value, proxy) {
    if (NOCHANGE.includes(key)) {
      throw Error(`Error! ${key} is immutable.`);
    }
    return Reflect.set(target, key, value, proxy);
  },
  deleteProperty(target, key) {
    if (NODELETE.includes(key)) {
      throw Error(`Error! ${key} cannot be deleted.`);
    }
    return Reflect.deleteProperty(target, key);
  },
  get(target, key, proxy) {
    if (DEPRECATED.includes(key)) {
      console.warn(`Warning! ${key} is deprecated.`);
    }
    var val = target[key];
    return typeof val === 'function' ?
      function(...args) {
        Reflect.apply(target[key], target, args);
      } :
      val;
  }
});
// these will throw errors or log warnings, respectively
dataObj.doNotChange = "foo";  
delete dataObj.noDelete;  
dataObj.oldMethod();


// 6、阻止非必要的重度资源消耗型操作
  // 假设你有一个服务器端点会返回一个非常大的文件。你不想在之前的请求还在进行中，而文件也还在下载中，或者它已经被下载过来一次的时候再次发起请求。
  // 代理对此缓冲这种类型的访问以及尽可能获取缓存值方面是一个很好的架构, 而不是让用户去尝试尽可能频繁的发起对端点的调用
  let obj = {  
    getGiantFile: function(fileId) {/*...*/ }
  };
  obj = new Proxy(obj, {  
    get(target, key, proxy) {
      return function(...args) {
        const id = args[0];
        let isEnroute = checkEnroute(id);
        let isDownloading = checkStatus(id);      
        let cached = getCached(id);
        if (isEnroute || isDownloading) {
          return false;
        }
        if (cached) {
          return cached;
        }
        return Reflect.apply(target[key], target, args);  // 用的是 Reflect.apply
      }
    }
  });