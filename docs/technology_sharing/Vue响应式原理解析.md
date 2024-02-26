# 💌纵观全局 -- 俯视代码
[语雀中已公开当前文章 -- 戳这里👈](https://www.yuque.com/luffy-j7ldi/yux7yt/nr33g2iuald76dmi) 

1. 创建 Vue 类

```javascript
class Vue {
  constructor(options) {
    this.$data = options.data
    Observe(this.$data)

    // 属性代理
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          // console.log('触发 this 上属性的 get 属性')
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        }
      })
    })

    // 调用模板编译的函数
    compiler(options.el, this)
  }
}
```

2. 创建 数据劫持方法

```javascript
function Observe(obj) {
  if (!obj || typeof obj !== 'object') return
  const dep = new Dep()

  Object.keys(obj).forEach(key => {
    let value = obj[key]
    Observe(value)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 如果实例存在的话就将实例添加到数组中
        Dep.target && dep.addSub(Dep.target)
        // console.log(dep)
        return value
      },
      set(newValue) {
        value = newValue
        Observe(value)
        dep.notify()
      }
    })
  })
}
```

3. 创建 compiler 方法

```javascript
function compiler(el, vm) {
  // 获取 el 对应的 dom 元素
  vm.$el = document.querySelector(el)

  // 创建文档碎片
  const fragment = document.createDocumentFragment()
  while (vm.$el.firstChild) {
    fragment.appendChild(vm.$el.firstChild)
  }
  // 进行模板编译 用一个函数封装起来，包含模板编译的全过程，就暂时不抽离出去了，省一些事
  replace(fragment)

  vm.$el.appendChild(fragment)

  // 负责对 dom 模板进行编译  核心中的核心函数
  function replace(node) {
    const regMustache = /\{\{\s*(\S+)\s*\}\}/ //匹配插值表达式的正则表达式
    // 判断是否为 文本节点
    if (node.nodeType === 3) {
      const text = node.textContent
      const regResult = regMustache.exec(text)

      if (regResult) {
        const value = regResult[1].split('.').reduce((item, key) => item[key], vm)
        node.textContent = text.replace(regMustache, value)
        new Watcher(vm, regResult[1], newValue => {
          // node.textContent = node.textContent.replace(regResult[0], value)
          node.textContent = text.replace(regMustache, newValue)
        })
      }
      return
    }
    // 判断是否为 input 节点
    if (node.nodeType === 1 && node.tagName.toUpperCase() === 'INPUT') {
      // 判断是否有 v-model 属性
      const attrs = Array.from(node.attributes) //伪数组转数组
      const model = attrs.find(x => x.name === 'v-model') //将含有 v-model 的节点的model值选出来 v-model="name",字符串格式,不符合的为null
      if (model) {
        const valueKey = model.value
        const value = valueKey.split('.').reduce((obj, key) => obj[key], vm)
        // console.log(value)
        node.value = value //现在只是首次编译的时候能同步
        // 使用发布订阅模式实现单向绑定
        new Watcher(vm, valueKey, newValue => {
          node.value = newValue
        })
        node.addEventListener('input', e => {
          // 取值  按 . 分割之后 再用 slice取到倒数第二个
          const keyArr = valueKey.split('.')
          const obj = keyArr.slice(0, keyArr.length - 1).reduce((newobj, key) => newobj[key], vm) //obj是到 倒数第二个属性
          // 赋值 替换
          // obj[keyArr.length - 1] = e.target.value
          const leafKey = keyArr[keyArr.length - 1] //取到最后一个属性
          obj[leafKey] = e.target.value //倒数第二个引用倒数第一个 属性,最终得到目标值的位置,替换值就好
        })
      }
    }

    node.childNodes.forEach(item => {
      replace(item)
    })
  }
}
```

4. 结合发布订阅者模式

```javascript
class Dep {
  constructor() {
    this.subs = [] //可以优化为 单例模式
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(item => item.update())
  }
}
```

```javascript
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this
    key.split('.').reduce((obj, key) => obj[key], vm)
    Dep.target = null
  }
  update() {
    const newValue = this.key.split('.').reduce((obj, key) => obj[key], this.vm)
    console.log(this.key)
    this.cb(newValue)
  }
}
```

# 💞视频顺序解析模块

## 🙂创建 Vue 类

```javascript
class Vue {
  constructor(options) {
    this.$data = options.data
    Observe(this.$data)

    // 属性代理
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          // console.log('触发 this 上属性的 get 属性')
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        }
      })
    })

    // 调用模板编译的函数
    compiler(options.el, this)
  }
}
```

---

1. 首先**创建 Vue 类**，构造函数中传入一个**配置对象**参数，在内部将 data 赋值给 $data 
2. 调用一下 **Observe 函数**，将 data 对象传入，内部的作用是对 data 中所有的数据进行劫持
   1. 后面结合发布订阅模式还 创建了一个 Dep 实例，用于在 触发 get 的时候判断 Dep 类中是否绑定了 watcher 实例，有的话就 执行 addSub 方法，也用于在 set 中值被更新时 调用 notify 去通知所有的订阅者
3. 通过**属性代理**的方式，为 vm 实例代理上 data 中的数据，是一个便捷方式，通过 this.name 方式 调用原本需要 this.$data.name 调用 的属性
4. 最后通过 执行 **compiler 函数**将用户编写的模板进行 模板语言 替换
   1. 主要是匹配 mustache 语法 以及 属性中动态绑定的属性值，将这些占位符替换为 data 中的数据

**总结：**

- **主要就是在 new Vue 的实例的同时执行以上五个步骤，为 Vue 实例做初始化，配置参数data的数据劫持以及模板的碎片化文档优化处理 **

## 😄创建 数据劫持 的方法

```javascript
function Observe(obj) {
  if (!obj || typeof obj !== 'object') return
  const dep = new Dep()

  Object.keys(obj).forEach(key => {
    let value = obj[key]
    Observe(value)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // console.log('执行了 get')
        // 如果实例存在的话就将实例添加到数组中
        Dep.target && dep.addSub(Dep.target)
        // console.log(dep)
        return value
      },
      set(newValue) {
        // console.log('执行了 set')
        // console.log(newValue)
        value = newValue
        Observe(value)
        dep.notify()
      }
    })
  })
}
```

---

1. 首先**判断**传入的参数**是否为对象类型**，如果不为对象类型那就直接 return
   1. 因为第一次传入的是 data 对象，一定是一个对象，所以这个限制只是作为下面 **递归处理 **时的退出条件，并不影响正常执行
2. 第一次一定是对象，于是进入到下面的代码，对**这个对象的每一个属性**进行 递归 劫持，主要是在 get 和 set 中要处理 **发布订阅** 的代码，所以才需要劫持
   1. 因为 属性的 get 和 set 有当数据被 取 或者 赋值 时就执行函数的特性，非常契合 发布订阅 中的当数据发生变化时 更新模板 中数据的修改，于是被选择使用！（vue3 中的 proxy 也只是替换了 这一功能而已，目的是更多的操作性以及让逻辑更加的合理）
   2. get 和 set 的劫持中有一个非常重要的点就是**防止 循环引用**！
      1. get/set 如果在内部重新 引用/赋值，那么就相当于一直触发 get/set
      2. 解决这一问题的方法是使用 **闭包**，通过在 劫持函数 调用之前，用一个变量存着那个值，之后更新与获取都通过这个值即可
   3. set 中 为了保证 修改后的 值也能够被劫持到，于是在修改后也要回调一下 Observe 方法，将新的值通过这个函数数据劫持

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679645866551-1868aaf3-91a1-479c-9a9b-b002986b79ac.png#averageHue=%23242a32&clientId=uc69149a7-9688-4&from=paste&height=340&id=u05b30e39&originHeight=518&originWidth=621&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=72072&status=done&style=none&taskId=ud83bddf0-c75a-4714-9995-4f2834dba15&title=&width=407.5426025390625)

3. 递归调用的方法非常值得学习，通过数组的 reduce()
   1. 两个参数，一个是回调函数，还有一个是初始值，默认为0
   2. 回调函数内部又需要两个参数，第一个是 上一次循环的返回值，第二个是当前项取得值
   3. 通过这个方法能够很好的解决 链式调用 的问题（info.name.a ==> 取到 a 的值）
4. 还有一个后面加入的代码，是一个非常秀的操作：
   1. 因为这个函数只会在 Vue 实例创建的那一刻执行，所以内部执行的同时创建一个 Dep 实例作为**全局的 收集者**，然后通过 在 get 和 set 中实现 发布订阅的相关功能
   2. get 中每次调用会判断 Dep 类中是否有 watcher 实例，如果有就 插入 全局收集者数组中 ，没有的话就不理会
   3. set 中每次触发会修改 data 中对应的值为最新的值，接着触发 notify 方法通知所有订阅者更新数据

## 😬创建 compile 模块

```javascript
function compiler(el, vm) {
  // 获取 el 对应的 dom 元素
  vm.$el = document.querySelector(el)

  // 创建文档碎片
  const fragment = document.createDocumentFragment()
  while (vm.$el.firstChild) {
    fragment.appendChild(vm.$el.firstChild)
  }
  // 进行模板编译 用一个函数封装起来，包含模板编译的全过程，就暂时不抽离出去了，省一些事
  replace(fragment)

  vm.$el.appendChild(fragment)

  // 负责对 dom 模板进行编译  核心中的核心函数
  function replace(node) {
    const regMustache = /\{\{\s*(\S+)\s*\}\}/ //匹配插值表达式的正则表达式
    // 判断是否为 文本节点
    if (node.nodeType === 3) {
      const text = node.textContent
      const regResult = regMustache.exec(text)
    	// 如果匹配的不为空
      if (regResult) {
        const value = regResult[1].split('.').reduce((item, key) => item[key], vm)
        node.textContent = text.replace(regMustache, value)
        new Watcher(vm, regResult[1], newValue => {
          // node.textContent = node.textContent.replace(regResult[0], value)
          node.textContent = text.replace(regMustache, newValue)
        })
      }
      return
    }
    // 判断是否为 input 节点
    if (node.nodeType === 1 && node.tagName.toUpperCase() === 'INPUT') {
      // 判断是否有 v-model 属性
      const attrs = Array.from(node.attributes) //伪数组转数组
      const model = attrs.find(x => x.name === 'v-model') //将含有 v-model 的节点的model值选出来 v-model="name",字符串格式,不符合的为null
      if (model) {
        const valueKey = model.value
        const value = valueKey.split('.').reduce((obj, key) => obj[key], vm)
        // console.log(value)
        node.value = value //现在只是首次编译的时候能同步
        // 使用发布订阅模式实现单向绑定
        new Watcher(vm, valueKey, newValue => {
          node.value = newValue
        })
        // 实现双向绑定:就是监听input事件,每次更新input都将data中的值进行一次更新,这一步应该不涉及发布订阅模式 v-model == @input +:value ,:value 和 :v-model 没啥区别,实际上就是用了这里的发布订阅模式
        node.addEventListener('input', e => {
          // 先获取到要修改的 data 中的值,然后用 input 中的新值替换就好
          // 取值  按 . 分割之后 再用 slice取到倒数第二个
          const keyArr = valueKey.split('.')
          const obj = keyArr.slice(0, keyArr.length - 1).reduce((newobj, key) => newobj[key], vm) //obj是到 倒数第二个属性
          // 赋值 替换
          // obj[keyArr.length - 1] = e.target.value
          const leafKey = keyArr[keyArr.length - 1] //取到最后一个属性
          obj[leafKey] = e.target.value //倒数第二个引用倒数第一个 属性,最终得到目标值的位置,替换值就好
        })
      }
    }

    node.childNodes.forEach(item => {
      replace(item)
    })
  }
}
```

---

**Main：compiler **的作用是将用户写好的 模板给提取到 **文档碎片 **中，在这期间对这个模板进行一些 操作，然后将修改好的 模板 添加到给页面的节点中进行渲染
**Think：**

1. 文档碎片的作用其实**类似于 template 模板标签**一样，可以整个添加回 app 节点中，结构与之前一样。但是**使用 createElement 创建新节点**也是可以的，只不过添加回去 app 节点的时候**得把子节点一个一个地** appendChild 过去，不能直接整体 appendChild ，这样的话就会变得多了一个节点在 app 中，可能会影响样式之类的 !
2. 一开始不知道 appendChild 居然是移动元素，也就是会自动删除原节点的对应内容，还去验证了一下。后面看了文档，发现 MDN 文档中写的也是会移动的！就算是学会了一些。（但是后面通过 creatElement 的方式，直接append整体，之后 那个 createElement 的节点还是存在内容的，不知道是不是因为整体移动，所以获取的还是这同一个节点，大概率是的，不然就是文档漏洞了 哈哈哈哈）

![62f1f9e4c03c9908e2e1e89753981dc.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679646135054-123754ae-6c9a-4efb-99f8-afbe5f791931.png#averageHue=%23f6f4f2&clientId=uc69149a7-9688-4&from=paste&height=394&id=uc6364613&originHeight=433&originWidth=822&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=44813&status=done&style=none&taskId=u4436ccfb-590f-4d2b-a729-7b1f0180785&title=&width=747.2727110760275)
**Study：**

1. **前言：**
   1. 用到了不少自己不熟悉的 api ，值得学习：**createDocumentFragment** 、 **appendChild** 、 **node.firstChild** 、** node.nodeType** 、** node.childNodes** -- 返回值是 nodelist 类型的数组 、文本节点有一个属性：**textContent** 是真正的文本，**文本节点也是一个对象**。
   2. 双向数据绑定中也涉及了：**node.nodeType**、**node.tagName**、**Array.from**、**attrs.find**、 **keyArr.slice**，作用各不相同，但是都比较考验功底。因为有很多字符串和数组的方法，作用都挺像的，看自己怎么选择！
2. 💥首先是参数，需要获取 el 和 vm ，也就是拿到 Vue 实例以及挂载的节点
3. 💥接着是获取到对应的节点，创建 文档碎片 后将节点内的元素都加入到 文档碎片 中
4. **🗯️🤠【重点中的重点】**：通过 **replace 函数** 对 文档碎片中 的 节点 进行处理，以达到我们最终想要的效果：
   1. 将 模板 中的 占位符 替换为 data 中的内容，接着使用 发布订阅 以及 数据劫持 对 data 中的每一个元素进行 监听，当发现数据变化后就更新 模板 的内容
   2. 【思考🕵️】看了这个 更新模板 的代码，发现根据 data 中数据修改，它修改的是 文档碎片 中的 模板内容，通过代码把模板替成真正的内容之后就把整个 文档碎片 移动到 #app 节点中了。那么如果数据又发生修改，是直接修改 html 页面中的内容实现实现重排，还是又将所有的加入到文档碎片重新编译一次呢？
      1. 自己解答：首先是不会重新加入到文档碎片的，因为没有重新调用 compiler 函数
      2. 其次更新内容的理论是：根据 data 中的数据变化，触发 set ，然后 set 去调用 订阅者实例的 updated 方法
      3. updated 方法的作用是获取更新后的值，然后将这个值传递给 cb 回调函数进行更新
      4. cb 回调函数的作用就是我想问的问题的关键了：cb 内部有形成一个闭包，可以拿到这个实例对应的 node 节点，将这个 node 节点的 textContent 的占位符 替换为 最新的值，通过这种方式完成数据的更新
   3. 【继续思考🕵️】很好，上一个问题算是解决了，又来一个问题：既然第一次就将占位符替换为内容，并且渲染好了，那么修改数据之后，watcher 内部还是 通过替换 regMustache 为 最新的值，问题是还匹配得到这个 regMustache 吗？是怎么匹配到的？
5. 💥编译完成后通过 `vm.$el.appendChild(fragment)` **将文档碎片插入回 #app 节点**中进行渲染！！！

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679639107294-34e84687-377a-4f16-9bf8-25a1e07dcc8c.png#averageHue=%23242932&clientId=uc69149a7-9688-4&from=paste&height=445&id=u2a9ab429&originHeight=489&originWidth=977&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=89078&status=done&style=none&taskId=u77bfe754-83fe-40dd-92d0-8c524c83191&title=&width=888.1817989309961)

---

6. 👹replace 方法中的**具体流程**：
   1. 首先是设置了一个**匹配 Mustache** 的**正则表达式**
   2. 接着判断 nodeType** 筛选出 文本节点**，然后通过 **占位符** 的内容 找到 data 中对应的数据，然后使用这个数据 **替换 **掉那个占位符 
   3. 最后 将这段 **更新数据的代码** 作为 watcher 实例的**回调函数 的内容**，创建一个 watcher 实例对象
      1. 这个实例对象一创建就会执行构造函数中对应的函数，最终的目的是这个 watcher 会被收集者管理起来，当这个节点中的数据对应的** data 中的数据发生变化**会触发这个 watcher 的回调函数对 模板 进行更新，实现**单向数据绑定**
7. 👺上一点中是讲匹配 插值表达式 的，我们还对** input 表单**也做了一个类似的处理
   1. 💖首先也是判断 nodeType 类型选出 input 节点
   2. 接着将具有 v-model 属性的节点再筛选出来
   3. 拿到 v-model 对应的 占位符，通过这个去索引 data 中对应的内容
   4. 💖拿到 data 中对应的内容后 替换掉 input 节点的 value 值
   5. 💖同样的，为了能够实现单向数据绑定，让 data 中对应的值修改时，input 中的 value 也对应的修改，我们也要创建一个 watcher 实例，并且将**这个 替换内容 的操作**作为 cb 回调函数的内容
   6. **tips**：写到这里我突然明白了，**数据劫持 **是对 data 中的数据进行劫持，当 data 中的数据发生变化的时候，会触发对应的 get 和 set 操作。而 **发布订阅模式** 就是让触发 set 操作的时候，对模板中的数据内容进行更新。所以**单向数据绑定也就是 data 中的内容发生变化的同时去修改模板中的内容，实现实时更新！！！**
8. 对于 input 表单只实现 单向数据绑定 只能说是熟悉了一遍 原理方法，本质和 mustache 的单向数据绑定没啥区别，但是 表单 的**双向数据绑定**就是一个新一些的知识了，不算难但是蛮考验功底的！
   1. 😺首先是对当前节点进行 input 事件监听，回调函数中传一个 e，可以拿到 表单中的 新值
   2. 😺其次是在回调函数中通过找到**要更新数据的位置**，这一步比较特殊：通过 v-model 的占位符去匹配 倒数第二个对象！（有点绕，但是原理很好理解，例如： obj.info.name,我们要修改 name ，那么就要拿到 obj.info ，然后通过 obj.info[name] 的方式去修改值）
   3. 😺匹配到之后 将 位置上的值 替换为 新值 就好了
9. 如果没有匹配到 文本节点 以及 input 节点的话，那么就一定是内部还有子节点，通过遍历 node.childNodes 的方式进行 **replace 递归**
   1. **不用担心会死循环**，因为最后一个节点一定会是 文本节点，这个 nodeType 将空白符如换行、空格也当成了 空白符

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679639142557-a8fb4965-8468-448a-8f42-eeb14d5136ff.png#averageHue=%23242a32&clientId=uc69149a7-9688-4&from=paste&height=320&id=uc0ebcc68&originHeight=352&originWidth=945&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=58049&status=done&style=none&taskId=u58cfde09-372f-4bdf-80b1-d24f9887042&title=&width=859.0908904706155)

## 😍创建 收集者类 以及 订阅者 类

```javascript
// 创建收集者类
class Dep {
  constructor() {
    this.subs = [] //可以优化为 单例模式
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(item => item.update())
  }
}

// 创建订阅者类
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this
    key.split('.').reduce((obj, key) => obj[key], vm)
    Dep.target = null
  }
  update() {
    const newValue = this.key.split('.').reduce((obj, key) => obj[key], this.vm)
    console.log(this.key)
    this.cb(newValue)
  }
}
```

---

1. 收集者类内部实际就**管理三个东西**，基本上不需要修改里面的代码
   1. 一个管理订阅者的数组，一般来说全局只能有一个，可以使用单例模式优化一下代码，防止创建 Dep 实例的时候又创建一个 数组；一个是 添加 Watcher 实例 的方法；一个是 发布通知 的方法

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679639403710-63b0a336-fa63-46e3-9593-b1a3859fe526.png#averageHue=%23232931&clientId=uc69149a7-9688-4&from=paste&height=218&id=uac56eb46&originHeight=386&originWidth=603&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=37440&status=done&style=none&taskId=u51571ae7-2b4b-4cec-84c5-6b3e8797767&title=&width=341.1647644042969)

2. 订阅者类内部有一些比较牛的技巧：
   1. 需要传入三个参数：vue实例，对应元素的 key(可能是 obj.info.name 这种形式，就是占位符嘛)，还有一个回调函数，用于当数据更新的时候执行的。**这个回调函数需要什么参数是在 watcher 实例被创建的时候定义的，与类的定义无关**
   2. **三行精彩的代码实现 **订阅者实例被添加到 收集者的数组中
      1. **第一行💘**：作用是让当前的 watcher 实例绑定到 Dep 类的类属性中，其目的实际上就是传参，让这个实例尽量成为顶层对象的属性，好让顶层对象下面的其他对象取值判断是否存在该值。这样的方式其他地方也有见过，类似的有通过原型链的继承方式，将公共的代码放在原型中作为共用
      2. **第二行💘**：作用是获取 data 中对应的值，触发它的 getter 方法；这个 getter 方法内部会判断 Dep 上是否绑定了 target ，如果绑定了就将此值插入到 dep 实例的数组中 （巧妙之处就在这）
      3. **第三行💘**：这一操作的目的就是让 watcher 实例被创建的同时将它传入 收集者数组，目的达到之后，这个 target 就可以从 Dep 中删除了，以免对后续 getter 的调用造成干扰
      4. **疑惑**🗯️🗯️：可能会产生一个困惑，随便取一个数，只要触发 getter 不就好了吗？既然 触发 getter 就一定会检查 Dep 上是否有 getter，那为什么一定要索引到 key 表示的最里面的元素呢？
      5. **解答：**

>          1. 确实，单从这个代码来看，是只要触发 getter 就判断是否存在实例。但是这只是简单的发布订阅模式，为了让我们更好地理解 vue 的深层次原理才没有将发布订阅写的那么完美，真要探究，那么 depSub 数组可能就是以对象的形式存在了，通过 key 保存 订阅对象，每一个订阅对象的值都是数组，存放一个个回调，这时候就不是简单的在 get 中 push 一个实例就好了，说不定得判断数组中是否有对应绑定的 key，然后将实例插入。


---

>          2. 补充：这个回答**可能只是引出了 发布订阅 的不完善**，并没有给出一个完美的完善方法，同时**可能也没有解决问题中 “只要触发 getter 就好了”这个问题**，但我认为在发布订阅模式完善的过程中会涉及到这一个点的。如果完善了也没有涉及到，那么确实可以想个方法不让 watcher 构造器去索引对应的值，而是存一个 能够触发 getter 的变量，每次创建实例的时候获取一下这个 getter 。！！甚至直接在 watcher 内部调用 addSub 的方法，创建实例了就直接被收集起来！！！（为什么不呢？我认为挺省事的，为什么要在 getter 中触发呢？）（又来一个问题，我暂时不想再解答了）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679642897941-3f5bbcd0-dde7-46ad-b0b8-dfa1c5f9ab09.png#averageHue=%23232930&clientId=uc69149a7-9688-4&from=paste&height=272&id=uabf15e4a&originHeight=299&originWidth=1352&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=55173&status=done&style=none&taskId=u6aaf915c-193f-42e9-ac83-059b1d18111&title=&width=1229.0908824510816)

---

![image.png](https://cdn.nlark.com/yuque/0/2023/png/20359134/1679643812646-b9028909-b7c5-4484-b3f3-09cfe4296d13.png#averageHue=%23232830&clientId=uc69149a7-9688-4&from=paste&height=692&id=ufe6446eb&originHeight=761&originWidth=1102&originalType=binary&ratio=1.100000023841858&rotation=0&showTitle=false&size=114637&status=done&style=none&taskId=u8b2f3cb0-a842-47d1-9f77-97183191c8c&title=&width=1001.818160104358)

      3. 最后，除了构造器，还有一个** update 实例方法**：
         1. 首先是 通过 创建实例的时候 传入的 vm 和 key 获取到 data 中保存的值（因为 update 的触发是在 setter 中，且 是更新完数据之后，所以**拿到的一定是更新之后的数据**，最新值）
         2. 接着是**调用当前实例的 cb 回调函数**，并且将新值传入，**进而实现 单向数据绑定**！！！就是调用了一下 cb（newValue），内部对 模板中的数据进行替换，实现了单向数据绑定！！！

# 💟总结

1. 😹😹😹这次学习中花了**三天**时间，包括：看视频、手敲、做笔记
2. ✋✋✋学习到的：
   1. 通过类的方式实现简单的发布订阅模式，之前是通过 调用 收集者内的 on() 和 emit() 方法实现的
   2. 学习过程分为四个阶段，首先是学习了 **数据劫持模块和属性代理（劫持 get 和 set）**， 其次是学习了** compiler 编译模块（页面一渲染能将模板渲染为对应内容）**，再次是结合 发布订阅 实现了**数据的单向绑定（修改 data 中的数据页面也会跟着 修改）**，最后是实现了 **input 的双向绑定** 
   3. 通过 reduce 的方法对 链式引用 取值的妙用，让自己掌握了 reduce 的用法，下次可以去试试写一个 数组扁平化 源代码了！！！
   4. 对 Object.definedProperty 这个方法更加理解了，用的多了就熟悉了
   5. 对于一些 HTML 节点的使用也更熟悉一些了，发现了之前自己对 DOM 元素的获取这一块欠缺很大，几乎没有使用过，例如 **nodeType**、**createDocumentFragment**、**node.attributes** 等等
   6. 也通过这次彬哥的教学方式有所启发：
      1. 彬哥是先把必须要掌握的知识先讲一遍，并且引出很恰当的使用场景（结合 Vue），很好理解
      2. 接着是慢慢引入一个个的**模块**讲解，只讲一下这样做的作用，让我们能够理解这样做能干什么，很少讲为什么要这样做
      3. 这样子将完整的双向数据绑定实现之后，我能够感觉到很大震撼的操作（虽然中间很多操作不知道为什么要这样做，但是能够知道按照老师这样做能有什么效果），最终激发我的兴趣一点点实践！
      4. 最终在手敲代码的时候会**自己思考**：为什么这里要这样做？这样做考虑了哪些细节？有的地方是不是考虑的不是特别好，可以完善（例如单例模式的收集者）？之前的知识点是不是也有这样做的例子（关联以前的知识点，例如 Dep 中绑定 Watcher 实例 **类比** **原型方式的继承**）？等等一系列的思考都是在实践中得来的。虽然过程很花时间，但是收获算是蛮大的，对于接下来学习 Vue 的原理或许会有很大的帮助！！！
3. 💯💯💯希望之后能不怕麻烦，多看看这篇 文章，实现完全理解 Vue 双向绑定原理，手写都能写出来吧！！！