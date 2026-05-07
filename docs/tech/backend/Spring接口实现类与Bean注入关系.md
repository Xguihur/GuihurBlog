---
title: Spring 中接口实现类与 Bean 注入关系
date: 2026/05/07
aiGenerated: true
tags:
 - Spring
 - IoC
 - 依赖注入
 - Java
 - AI生成
---

## 现象

在 Spring 项目里，经常会看到这样的写法：

- 成员变量声明的是接口类型
- 构造器参数也是接口类型
- 代码里没有显式 `new` 实现类

但运行时却能正常调用实现方法。

## 本质原因

这背后是 Spring 的 `IoC` 和 `DI`：

- `IoC`：对象的创建和管理交给 Spring 容器
- `DI`：Spring 把依赖自动注入到需要它的类中

也就是说，业务代码不负责手动创建实现类，而是由 Spring 容器提供合适的 Bean。

## 典型关系

```java
public interface UserService {
    void createUser();
}
```

```java
@Service
public class UserServiceImpl implements UserService {
    @Override
    public void createUser() {
        // 具体实现
    }
}
```

```java
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```

## Spring 是怎么完成注入的

可以把过程理解成下面几步：

1. Spring 启动时扫描到 `@Service`。
2. `UserServiceImpl` 被注册成一个 Bean。
3. 因为它实现了 `UserService`，所以也能按接口类型被查找。
4. `UserController` 需要 `UserService` 时，Spring 去容器里找匹配类型的 Bean。
5. 如果当前只有一个实现类，就把它注入进去。

所以代码里虽然写的是接口类型，但实际注入的通常是某个实现类对应的 Bean。

## 为什么接口类型也能调用实现方法

这是 Java 多态的体现：

- 变量声明类型可以是接口
- 变量实际引用对象可以是实现类实例

```java
UserService userService = new UserServiceImpl();
userService.createUser();
```

Spring 注入后的效果，本质上和这段代码一致，只是对象创建和赋值由容器接管了。

## 这不是重载，而是重写

这里容易混淆两个概念：

- `overload`：重载，同名方法但参数不同
- `override`：重写，实现类对接口方法重新实现

当前场景属于“实现接口并重写方法”，不是重载。

## 这种写法的好处

- 降低对具体实现类的依赖
- 后续替换实现更方便
- 测试时更容易注入 mock
- 更符合 Spring 的分层和扩展方式

## 多个实现类时会发生什么

如果一个接口有多个实现类，按类型注入时就会出现候选冲突。

例如：

- `UserServiceImpl`
- `UserServiceMockImpl`

这时 Spring 不知道该注入哪一个，需要你进一步指定。

## 常见解决方式

### `@Primary`

当某个实现类应该作为默认实现时，可以这样写：

```java
@Service
@Primary
public class UserServiceImpl implements UserService {
}
```

含义是：同类型 Bean 有多个时，优先注入这个实现。

### `@Qualifier`

如果想在某个注入点精确指定实现类，可以这样写：

```java
@Service("dbUserService")
public class UserServiceImpl implements UserService {
}
```

```java
@Service("mockUserService")
public class UserServiceMockImpl implements UserService {
}
```

```java
public UserController(@Qualifier("dbUserService") UserService userService) {
    this.userService = userService;
}
```

## `@Service` 和 `@Repository` 的关系

很多时候，实现接口并被注入的不只有 `Service`，也可能是 `Repository`。

它们的共同点是：

- 都能被 Spring 扫描并注册为 Bean
- 都可以按接口类型注入
- 注入机制本身没有本质区别

主要区别在于职责语义：

- `@Service`：业务逻辑层
- `@Repository`：数据访问层

所以一个类该用哪个注解，重点不在“能不能注入”，而在于它属于哪一层。

## 一句话记忆

接口类型能被正常注入，不是因为代码里隐藏了 `new`，而是因为 Spring 容器帮你找到了合适的实现类 Bean。
