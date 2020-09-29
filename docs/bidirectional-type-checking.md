# Bidirectional Type Checking

2020-09-29

- Examples:
  link:cicada/lang1/check.cic
  link:cicada/lang2/check.cic

假设在 datatype 中定义数据构造子时，
其类型所代表的是纯逻辑式编程。
即所有的关系都是可逆的。
- 但是在 dependent type system 额 judgment 中，情况不是如此，
  因为 evaluate 不是可逆的。

双向的类型检查在于，关系的单值性，即关系是否是函数。
具体对于 Check 而言，假设第三个参数 t 为输出。
注意关系是函数，与有算法计算这个函数还差一步。

关于双向类型检查与函数单值性，有一个有趣的 user story。
首先要知道 Check 对第三个参数 t 的单值性，将给出函数 infer。
假设我想实现函数 check 来自动生成关系 Check 的证明。
一、我发现只有当我能 infer ap 的 target，才能 check ap，
二、而且，额外地，当我能 infer ap 的 target，我就不光能 check ap，并且也能 infer ap，
三、为了 infer ap 的 target 我必须能够 infer fn，
四、fn 的 Check 对其第三个参数 t 不具有单值性，因此无法实现 infer，
五、为了 fn 而加 annotation 这个新 Exp，并且把类型检查 judgment 分为两个方向的 infer 与 check。

为什么说「fn 的 Check 对其第三个参数 t 不具有单值性」？
通过把逻辑式转写成函数式，并且用到对变量的赋值，可以自动检验一组 judgment 对某一个参数位置的单值性。

we can use lower case letters as logic
variable, because const are in namespaces.

如果有检验关系就某一个参数，是否具有单值性的算法，
我们就可以用我们的 inference rule syntax
来表达 bidirectional type checking 相关的知识。

通过把逻辑式转写成函数式，并且用到对变量的赋值，
可以自动检验一组 judgment 对某一个参数位置的单值性。

以 Check.fn 这一个 inference rule 为例，检验其就第三个参数的单值性。

Check(ctx, Exp.fn(name, ret), Ty.arrow(arg_t, ret_t))
------------------------------------------------------- fn
ret_ck: Check(Map.extend(ctx, name, arg_t), ret, ret_t)

假设 Ty.arrow(arg_t, ret_t) 是未知的，
因此 arg_t 是未知的，
因此 arg_t 不应在 ret_ck 的类型的
第一个参数 Map.extend(ctx, name, arg_t) 中出现，
因此单值性检验失败。
