
### visibility 与display的区别

隐藏一个元素可以通过把display属性设置为"none"，或把visibility属性设置为"hidden"。
visibility:hidden可以隐藏某个元素，但隐藏的元素仍需占用与未隐藏之前一样的空间。也就是说，该元素虽然被隐藏了，但仍然会影响布局。

### 选择器

类选择器： .box
id选择器：#box
后代选择器：div p {}
子元素选择器： div>p {}
相邻兄弟选择器： div+p{}
后续兄弟选择器： div~p{}
属性选择器：input[type="button"]

### 权重

    1、内联样式的权重： 1000
    2、id选择器： 100
    3、代表类，class、伪类、:hover等： 10
    4、元素选择器、伪元素选择器： 1
    
    
    通用选择器（*），子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以他们的权值都为0。

    带有!important 标记的样式属性的优先级最高;

### 常见考试题

    1、实现一个三角形
        .tangle {
            width: 0px;
            height: 0px;
            border: 20px solid transparent;
            border-left-color:tomato;
            transform: rotate(45deg);
            margin-left: 20px;
        }

### 盒模型

    css盒模型本质上是一个盒子，封装html元素 ；
    分为标准盒模型盒怪异盒模型；
    一般浏览器默认是标准盒模型；
    可以通过设置box-sizing：border-box开启怪异盒模型、content-box，标准盒模型；

    标准盒模型的宽高= 内容区域 + padding + border； 
    所以下列的box在标准盒模型中的宽：124px 

    在怪异盒模型中的宽为： 100 = content + padding + border；

    #box {
        width: 100px;
        height: 100px;
        margin: 50px;
        padding: 10px;
        background-color: aquamarine;
        border: 2px solid #ff5151;
    }

### 什么是BFC、如何触发BFC、BFC的作用
    BFC叫做块级格式上下文，是一个独立的布局区域；并且该区域的布局不会影响外部布局

    如何触发：
    1）根节点
    2）浮动定位：float为非none
    3）绝对定位：position为absolute或flex；
    4）display为flex、inline-block
    5）overflow为除了visible之外的值；

    解决什么问题：
    1）垂直方向两个元素的margin重叠
    2）使浮动元素自动撑起容器的高度
    3）组织元素被浮动元素遮盖

### inline、inline-block、block的区别

    inline：行内元素、设置宽高无效、垂直方向的margin无效、水平方向的margin有效；水平和垂直方向的padding都有效；不会换行
    inline-block：可以设置宽高、水平和垂直方向的margin、padding都有效；前后无换行
    block：前后有换行、可以设置宽高；水平方向和垂直方向的margin与padding都有效