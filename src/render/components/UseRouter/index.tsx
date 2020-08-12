/**
 * hooks获取history参数等
 */

import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';
import { useMemo } from 'react';


// Hook
export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  return useMemo(() => {
    return {
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      query: {
        ...queryString.parse(location.search),  // string转为对象
        ...params
      },
      match,
      location,
      history
    };
  }, [params, match, location, history]);
}

// 使用
// function MyComponent(){
//   const router = useRouter();
//   // 获取参数 (?postId=123) or (/:postId)
//   console.log(router.query.postId);
//   // 获取路由
//   console.log(router.pathname)
// }