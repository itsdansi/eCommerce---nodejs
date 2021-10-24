function errorHandeler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized!" });
  }
  if (err.name === "ValidationError") {
    return res.status(401).json({ error: err });
  } else res.status(500).json({ error: err });
}

module.exports = errorHandeler;
