---
title: TOTP 原理解析
date: 2024/03/30
---

## 资源

> 参考了两篇文章，大致对于 2FA 验证有了基础的理解以及对 TOTP 算法感到伟大

**2FA 的介绍：** 
[什么是双因素身份认证 (2FA)？ | Fortinet](https://www.fortinet.com/cn/resources/cyberglossary/two-factor-authentication)

**Github TOTP 原理：** 
[GitHub双重认证（2FA）实现原理浅析 - 掘金](https://juejin.cn/post/7299743820434112539)

## 自己思考：

1. 这个 TOTP 验证方法，我理解的实现原理：
   1. 首先 github 生成一个密钥，通过二维码让用户扫码
   2. 用户使用 神锁 等 Authenticator 应用扫码识别，获取到 密钥，并且根据当前的 时间 使用与 github 一样的 TOTP 算法生成一个 验证码 ，这个验证码显示在 Authenticator 工具中，输入到 github 通过验证就建立起链接了，之后登录 github 就需要手机上的这个 验证码 辅助了
   3. 神锁 等 Authenticator 应用实际上就是通过这个 密钥 + 当前时间（有30s的取余操作） + TOTP 算法计算，得到一个验证码展示在应用上，所以它能实现离线校验（这个和我昨天自己猜测的大差不差，只是现在更加了解这个细节了）
   4. 知道了原理，实际上也能自己使用代码帮我生成对应的验证码，不借助 神锁 也可以，甚至可以直接发给 GPT 帮我算当前结果
2. 注意的点：
   1. 在 神锁 等 APP 中生成后，理论上密钥文件可以删除，只要不清空 神锁 的密码
   2. 相互校验不会涉及密钥传输，但是如果 清除缓存或者换设备了，或者想给别的设备同步验证码，就需要用到 密钥 结合算法生成验证码，所以密钥的作用其实是 用于忘记密码时使用，或者想要 拓展多个设备 使用
3. 对这个 2FA 的方案太佩服了！

---

## 代码实践

> 结合俊杰哥的代码进行了测试以及研究 , 对其中的关键函数进行了分析, 其中涉及到非常多的 二进制位运算 值得学习

### 源码:
::: details 点击查看源码
```javascript
// const twofactor = require('node-2fa')
const base32 = require('thirty-two')
const crypto = require('crypto')

const secret = '88888888'

// const newToken = twofactor.generateToken(secret)

// console.log(newToken)

/**
 * 1. generateToken
 *
 */

function generateToken(secret) {
  if (!secret || !secret.length) {
    return null
  }
  const unformatted = secret.replace(/\W+/g, '').toUpperCase()
  const bin = base32.decode(unformatted) // 进行 base32 解码，然后使用原始的密钥参与计算。
  const counter = generateTime()
  // 至此，密钥和时间时间戳已经拿到了，接下来结合TOTP算法计算出最终的token值。

  var p = 6

  // Create the byte array
  // console.log(counter)
  // console.log(intToBytes(counter))
  var b = Buffer.from(intToBytes(counter)) // 转换成字节数组

  var hmac = crypto.createHmac('sha1', Buffer.from(bin)) // 创建 HMAC 对象

  // Update the HMAC with the byte array
  var digest = hmac.update(b).digest('hex') // 更新 HMAC 的数据，并返回摘要值
  // 代码解释以及学习：
  // update() 方法用于将数据提供给 HMAC 对象。在这个方法调用之后，HMAC 对象会使用这些数据来生成一个密钥摘要。
  // .digest() 方法用于从 HMAC 对象中获取摘要，而 .digest('hex') 则是将摘要转换为十六进制字符串格式。

  // console.log(digest)
  // Get byte array: 最终是 20 字节的摘要值
  var h = hexToBytes(digest)
  // console.log(h)

  // Truncate  这些位运算有点炫酷，值得学习以及研究一下。
  // 为什么会想到使用位运算来实现呢？百度乱回答不太可信
  // 为什么最终的结果并不是 4 个字节，而是 10 位数字？ 有待研究
  var offset = h[19] & 0xf
  var v = ((h[offset] & 0x7f) << 24) | ((h[offset + 1] & 0xff) << 16) | ((h[offset + 2] & 0xff) << 8) | (h[offset + 3] & 0xff)
  // console.log(v)
  v = v + ''

  return v.substr(v.length - p, p)
}

/**
 *
 * @param {时间间隔} offset
 */
function generateTime(step) {
  var timeStep = step || 30
  var _t = new Date().getTime()
  var counter = Math.floor(_t / 1000 / timeStep)
  return counter
}

function intToBytes(num) {
  var bytes = []

  for (var i = 7; i >= 0; --i) {
    bytes[i] = num & 255
    num = num >> 8
  }

  return bytes
}

/**
 * convert a hex value to a byte array
 * @param {String} hex string of hex to convert to a byte array
 * @return {Array} bytes
 */
function hexToBytes(hex) {
  var bytes = []
  for (var c = 0; c < hex.length; c += 2) {
    var _hex = hex.substr(c, 2)
    // console.log(_hex)
    bytes.push(parseInt(_hex, 16))
  }
  return bytes
}

console.log(generateToken(secret))

```
:::

### 总结

- 俊杰给出了两种方法, 第一种是使用第三方库 `node-2fa`  来实现, 第二种是自己使用 代码 来实现
- 主要学习的是第二种方法中用到的技术
  - 位运算实现 **intToBytes** **、hexToBytes** 、最后生成结果时用到的 **偏移量计算** 以及 **值获取** 都涉及到了`二进制位运算`
  - 其中还有 number 转 string 的 快捷方法学习 、NodeJS 自带的类调用-BUffer 等