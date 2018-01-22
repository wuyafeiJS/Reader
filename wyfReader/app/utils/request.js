// import axios from 'axios'
// import { Toast } from 'antd-mobile'
// //  let checkStatus=(response)=>{
// //    if (response.status >= 200 && response.status < 300) {
// //     return response;
// //    }
// //    const error = new Error(response.statusText);
// //    error.response = response;
// //    throw error;
// //  }

//  const handledata=(data)=>{
//   if(!data) data={ msg: '研发GG正在加班修复中，请您稍后再试' }
//   if(data.code === 0) {
//     Toast.hide()
//     // if(data.msg) Toast.success('操作成功',4);
//     return data
//   }
//   // else if(data.code == 401 || data.code == 11){
//   //   if(data.msg) Toast.fail('未绑定广发通账号', 2);
//   // }
  
//     Toast.hide()
//     return data
  
//  }

// const handleError=(err)=>{
//    Toast.hide()
//    Toast.fail(err.msg||'火星网络传输慢，下拉返回地球哦~',2)
// }

// /**
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */

// export default async function request(url, options) {
//   const path = `http://localhost:5000${url}`
//   // Toast.loading('Loading...',10);
//   const response = await fetch(path, {...options,credentials:'include'})
//   try {
//     const data = await response.json()
//     handledata(data)
//     const ret = {
//       data
//     }
//     return ret
//   } catch (err) {
//     handleError(err)
//   }
// }