#1.简介

这是一款基于jQuery写的一个表单验证脚本，在项目有时候碰到表单验证错误消息需要弹窗，有时候需要输入框旁边提示错误信息。
所以，我干脆写了一个表单验证插件当验证不通过的时候通过回调的办法自己处理错误消息。以下是插件基本配置和使用方法。

#2.使用方法

##2.1基本配置

html代码的基本结构如下：

``` html
<form id = "myform">
    <input type = "text" rule = "int"  validator = "true">
    <input type = "text" regexp = "/^\\d+$/" msg = "测试" validator = "true">
</form>
``` 

input输入框配置，validator属性有值有两种`true`或`false`,`true`表示这个输入框需要验证，`false`表示不验证。
rule属性值存放的是验证这个输入域的的规则，(例如:`int float money number ...`)。
regexp属性值为正则表达式（注意：需要常规的字符转义规则（在前面加反斜杠 \）。比如\d需要写\\\d）。
msg属性值为当自定义规则不通过之后的错误提示消息。

##2.2基本配置

js代码调用代码：

```javascript
<script>
    $(function(){
        Validator.init($("#myform"),function(input,errmsg){
            console.log(input);
            console.log(errmsg);
        });
    });
</script>
```
`Validator.init(form,function(input,errmsg){})`,form参数表示的表单对象(如果页面上有多个表单，支持多表单验证)，回调函数：`function(input,errmsg){}`的input表示的是验证失败的input对象，errMsg是数组类型存放的是验证失败信息。
上述所说的对象都是jQuery对象，在回调函数中可以通过jQuery对象的方法对输入框操作。

#3.所有验证规则
