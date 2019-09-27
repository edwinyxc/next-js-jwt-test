const jwt = require('jsonwebtoken');
export const CookieAuthenticator = ({ 
  loginPath,
  auth, //resolve decoed 
  remoteLogin, // token get promise
  onRemoteLogin,
  ...options
}) => (req, res, next) => {

  //assert req.cookie has been parsed
  if( !req.body ) {
    const errMsg = "req.body parse failed. use CookieParser first!"
    console.error(errMsg)
    throw Error(errMsg)
  }

  //assert req.cookie has been parsed
  if( !req.cookies ) {
    const errMsg = "req.cookies parse failed. use CookieParser first!"
    console.error(errMsg)
    throw Error(errMsg)
  }
  
  console.log("Cookies _server.js ", req.cookies)
  console.log(`[Request Path -- ${req.path}]`)

  auth(req).then(
    decodedToken => {
      res.setCookie
      next()
    },
    () => remoteLogin(req).then(
      res => onRemoteLogin(res).then(
        next,
        () => res.redirect(loginPath)
      ).catch(e) {
        res.status(500).send(e)
      }
  ).catch(e) {
    res.status(500).send(e)
  }
}  

const secret = '123123hjslhdj;jskfhjsfjknfdnnvvkn;"'

var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, secret);


export const JWTCookieParser = ({
  loginPath,
  validator,
  requireLogin
}) => CookieAuthenticator({
  loginPath,
  auth : req =>  new Promise((resolve, reject) => {
    let jwtToken = req.get('Authorization') 
    if (jwtToken === undefined) {
      reject(null)
      return
    }
    jwt.verify(token, secret, (err, decoded ) => {
      if (err) {
        reject()
      }
      else {
        // TODO expired?
       validator(decoded).then(resolve, reject)
      }
    })
  }),
  remoteLogin : requireLogin,
})

