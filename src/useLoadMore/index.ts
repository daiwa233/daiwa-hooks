import { useState, useEffect, useCallback, useReducer, useRef } from 'react';

interface UseLoadMoreReturnProps {
  data: any[];
  handleLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

const useLoadMore = (
  fetchDataFn: (arg: { PageSize: number; PageNumber: number }) => Promise<unknown>,
  options: {
    size: number;
    effects?: any[];
  }
): UseLoadMoreReturnProps => {
  const pageSize = options?.size || 24;
  const effectArr = options.effects || [];
  const [data, setData] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const rollbackRef = useRef(false);
  const [updateFlag, forceUpdate] = useReducer((x) => x + 1, 0);

  const fetchData = async () => {
    if (rollbackRef.current) {
      // 重置是否回滚的状态
      rollbackRef.current = false;
      return;
    }
    try {
      setLoading(true);
      const rst =
        (await fetchDataFn({
          PageNumber: pageNumber,
          PageSize: pageSize,
        })) || [];

      const responseData = rst as any;

      if (responseData.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      // 当 pageNumber > 1 时，需要接续data
      if (pageNumber > 1) {
        const temp = data.slice();
        temp.push(...responseData);
        setData(temp);
      } else {
        setData(responseData);
      }
    } catch (err) {
      console.log(err);
      // 请求出错时需要回滚 PageNumber 状态, 同时不能新发请求
      setPageNumber((state) => (state - 1 > 1 ? state - 1 : 1));
      rollbackRef.current = true;
    } finally {
      setLoading(false);
    }
  };
  // 当外部变量变化时，重置 pageNumber 和 hasMore
  useEffect(() => {
    setPageNumber(1);
    setHasMore(true);
    // // 当内部状态没变化时，需要依靠这个来触发 fetchData
    forceUpdate();
  }, [pageSize, ...effectArr]);

  // 触发重新 fetchData 时只有在 pageNumbe 变化时去 fetchData
  useEffect(() => {
    fetchData();
  }, [pageNumber, updateFlag]);

  const handleLoadMore = useCallback(() => {
    setPageNumber((state) => state + 1);
  }, []);

  return { data, loading, handleLoadMore, hasMore };
};

export default useLoadMore;
