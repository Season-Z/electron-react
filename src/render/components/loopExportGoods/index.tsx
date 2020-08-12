// /**
//  * 循环导出商品
//  */

// import React, {useState, useEffect} from 'react'
// let myInterval:any = null
// const loopExportGoods = () => {
//   const [count, setCount] = useState<boolean>(false)

//   function interval () {
//     myInterval = setInterval(async () => {
//       if (count >= 5) {
//         clearInterval(myInterval)
//         return;
//       }

//       setCount(count + 1)
//       // 在本函数内定义 myInterval 然后打开下面注释也是可以的
//       // clearInterval(myInterval)
//     }, 1000)
//   }
//   useEffect(() => {
//     // if (count > 0) {
//     //   interval()
//     // }
//     return () => clearInterval(myInterval)
//   })
//   return (
//     <div onClick={interval}>click me to count {count}</div>
//   )
// }

// export default React.memo(loopExportGoods)