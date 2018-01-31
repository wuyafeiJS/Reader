let request = {};
const prefix = 'http://localhost:5000'
request.get = (url) => {
  let options = {
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    }
  }
  let link = `${prefix}${url}`
  return new Promise((resolve, reject) => {
    fetch(link, options).then(res => {
      if (res.ok) {
        return res.json()
      }
      return reject({ status: res.status })
    }).then(res => {
      resolve(res)
    }).catch((err) => {
      reject({status: -1, msg: err.message})
    })
  })
}
// request.post = ()

export default request