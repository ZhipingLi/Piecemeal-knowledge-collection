// 写一个重试函数 loop，接收两个参数：待重试函数 fn，重试次数 count，实现如下功能：
// 1. 至多执行重试函数 count 次；
// 2. 执行成功，立即返回执行成功的结果；
// 3. 执行失败，返回所有执行失败的结果列表；


// 注意：fn 可能是同步的，也可能是异步的。

// 纯Promise
function loop(fn, count) {
  const errArr = []
  return execFn(fn, count)

  function execFn(fn, count) {
    return new Promise((resolve, reject) => {
      if(errArr.length === count) {
        reject(errArr)
        return
      }
      new Promise((resolve, reject) => {
        try {
          resolve(fn())
        } catch (error) {
          reject(error)
        }
      }).then(res => resolve(res), err => {
        errArr.push(err)
        resolve(execFn(fn, count))
      })
    })
  }
}

// Promise + async
function loop(fn, count) {
  const errArr = []
  return execFn(fn, count)

  function execFn(fn, count) {
    return new Promise(async (resolve, reject) => {
      if(errArr.length === count) {
        reject(errArr)
        return
      }
      try {
        const res = await fn()
        resolve(res)
      } catch (error) {
        errArr.push(error)
        resolve(execFn(fn, count))
      }
    })
  }
}

// async
function loop(fn, count) {
  const errArr = []
  return execFn(fn, count)

  async function execFn(fn, count) {
    if(errArr.length === count){
      return Promise.reject(errArr)
    }
    try {
      // try-catch中await一个rejected promise会进入catch
      return await fn()
    } catch (error) {
      errArr.push(error)
      return execFn(fn, count)
    }
  }
}

const fn1 = () => {
  console.log(1);
}

const fn2 = () => {
  console.log(x);
}

const fn3 = () => {
  return Promise.reject(1);
}

loop(fn1, 5).then( res => console.log('执行成功：' + res), errArr => console.log('执行失败：' + errArr));
loop(fn2, 5).then( res => console.log('执行成功：' + res), errArr => console.log('执行失败：' + errArr));
loop(fn3, 5).then( res => console.log('执行成功：' + res), errArr => console.log('执行失败：' + errArr)); 
