const makeNameUpperCase = (req, res, next) => {
  const postOrPutRequest = (req.method === "POST" || req.method === "PUT");

  if (postOrPutRequest && req.body.name) {
    let name = req.body.name.replace(/\b\w/g,
      char => char.toUpperCase()
    );

    req.body.name = name;
  }

  next();
}

module.exports = {
  makeNameUpperCase
};
