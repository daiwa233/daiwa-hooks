import { useState, useEffect, useCallback, useRef } from 'react';

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
      setPageNumber((state) => {
        if (state > 1) {
          rollbackRef.current = true;
          return state - 1;
        }
        return 1;
      });
      rollbackRef.current = true;
    } finally {
      setLoading(false);
    }
  };
  // 当外部变量变化时，重置 pageNumber 和 hasMore
  useEffect(() => {
    setPageNumber((state) => {
      if (state === 1) {
        fetchData();
      }
      return 1;
    });
    setHasMore(true);
  }, [pageSize]);

  // 当外部变量变化时，重置 pageNumber 和 hasMore
  useEffect(() => {
    setPageNumber((state) => {
      if (state === 1) {
        fetchData();
      }
      return 1;
    });
    setHasMore(true);
  }, [...effectArr]);

  // 触发重新 fetchData 时只有在 pageNumbe 变化时去 fetchData
  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const handleLoadMore = useCallback(() => {
    setPageNumber((state) => state + 1);
  }, []);

  return { data, loading, handleLoadMore, hasMore };
};

export default useLoadMore;
