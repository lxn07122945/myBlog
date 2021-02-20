### visibility 与display的区别
隐藏一个元素可以通过把display属性设置为"none"，或把visibility属性设置为"hidden"。
visibility:hidden可以隐藏某个元素，但隐藏的元素仍需占用与未隐藏之前一样的空间。也就是说，该元素虽然被隐藏了，但仍然会影响布局。


### 选择器
后代选择器：div p {}
子元素选择器： div>p {}
相邻兄弟选择器： div+p{}
后续兄弟选择器： div~p{}
属性选择器：input[type="button"]


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