# useLoadMore
加载更多 hook ，封装了触发加载更多时的一些逻辑。
- 请求的异常处理（回滚状态）
- 当外部变量变化时，以初始状态重新 fetchData

## usage
todo

## API

### Options

```ts
interface UseLoadMoreReturnProps {
  data: any[];
  handleLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}
type fetchDataFnType = (arg: { PageSize: number; PageNumber: number }) => Promise<unknown>;
interface useLoadMoreOptions {
  size: number;
  effects?: any[]; // 重新请求的副作用数组
}
// useLoadMore type 
(fetchDataFn: fetchDataFnType, options: useLoadMoreOptions) => UseLoadMoreReturnProps;
```
> 默认传入 fetchFn 中为分页参数，Key 为 PageSize PageNumber。如果需要增加传参和修改 key ，可以在 fetchFn 中额外添加一些逻辑


## TODO
- [ ] 完善 README， 添加 usage
- [ ] 单测
- [ ] 解决首次渲染时会触发两次 fetchData 