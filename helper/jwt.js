const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const url = process.env.API_URL;
  //   secret = 10;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/product(.*)/, method: ["GET", "OPTION"] },
      { url: /\/api\/v1\/category(.*)/, method: ["GET", "OPTION"] },
      `${url}/user/login`,
      `${url}/user/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
