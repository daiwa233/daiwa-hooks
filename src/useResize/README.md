## Introduction
一个 react hook, 传入相应的配置可以对 `target` 或 `window` 宽度的变化作出响应

## Usage

> hook 接受下列参数，不返回任何内容 

| 参数 | 类型 | 说明 | 默认值 |  
| ---- | ---- | ---- | --- | 
| breakpoint | number | 触发响应式布局的断点 单位为 px | - |
| onBreakpoint | (broken: boolean) => void; | 触发断点时的回调。 broken 为 true 时代表当前待观测元素的宽度大于 breakpoint。为 false 时反之。 只会触发一次。 | - | 
| target | string / Element | 待观测的目标元素 | document.body |


## tips
`useEffect` 比较 `deps` 时，对于引用数据类型是比较引用，对于基本数据类型则比较值。[测试代码](https://codesandbox.io/s/fervent-wozniak-t51pi?file=/src/UseEffectTest.tsx)

所以为了避免多次添加、销毁 `ResizeObserver`,应该避免频繁修改 onBreakpoint 回调函数 和 target


## TODO
- test 
