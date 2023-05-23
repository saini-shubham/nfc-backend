// Token verification middleware
const verifyToken=(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    } // Add the decoded token payload to the request object

    req.user = decoded;
    next();
  });
}

// module.exports={verifyToken}
