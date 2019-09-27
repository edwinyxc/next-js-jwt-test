const next = require("next");
const request = require('request');
const routes = require("next-routes");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = next({ dev: process.env.NODE_ENV !== "production" });
//routes
const Routes = routes();

const handler = Routes.getRequestHandler(app);
// With express
const express = require("express");

const sessions = {};
const secret = "xxxx";

//my interceptor
const LogginHandler_cookie = (req, res, next) => {
  console.log('LogginHandler_cookie', req.path, req.query)
  const path = req.path
  const loginPath = "/api/login";

  if(path !== loginPath && !path.startsWith('/my') ) {
    next()
    return
  }

  const redirect = () => {
    res.clearCookie("token");
    res.redirect("/login");
    next();
  };

  const tokenInCookie =  req.cookies["token"]
  const token = req.get("Authorization") || tokenInCookie 
  console.log('tokenInCookie', tokenInCookie, token)

  //--------start 
  //new session
  //clean login
  if (!token  && req.path === loginPath) {
      const { username, password } = req.query;
      console.log(username, password, req.path, req.query)
      //real login
      request({
        url : `https://st00.xyz/login`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          DEVICE_TYPE: "WEB",
          email_or_mobile_or_username: username.trim(),
          login_password: password.trim()
        })
      }, (e, response, b) => {
        if (response && b) {
          let { ok, session_id, ...all } = JSON.parse(b)
          console.log('if response', ok, session_id);
          if (ok) {
            //1. encryption
            console.log(1)
            jwt.sign( { 
              sessionId: session_id
            }, secret, { expiresIn: 60 },
              (err, signedToken) => {
                if(err) {
                  // verification failed
                  console.log('err 1')
                  res.send(400, {err})
                } else {
                  //2. Set-Cookie
                  console.log(2)
                  // TODO sync data
                  res.cookie('token', signedToken,  { maxAge : 360000 , path : '/', httpOnly: true }).status(200).send({
                    ok, session_id, ...all
                  })
                }
              }
            );
          } else {
            console.log('err remote login failed', response.statusCode, b)
            // remote login failed
            res.send((response.statusCode === 200 ? 500 : response.statusCode), b)
          }
        } else {
          // no response
          res.send(500)
        }
      })
    return
  }
  
  //normal entry
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      //require login remotely
      console.log('before delete', token, err)
      delete sessions[token]
      console.log(22)
      redirect();
      next();
    } else {
      // TODO expired?
      // validator(decoded).then(resolve, reject)
      //sync state
      if (decoded.sessionId) {
        console.log('before bind')
        sessions[token] = decoded;
        next();
      } else {
        console.log(33)
        redirect();
        next();
      }
    }
  });
};

app.prepare().then(() => {
  express()
    .use(cookieParser())
    .use(LogginHandler_cookie)
    .use(handler)
    .listen(3000);
});
