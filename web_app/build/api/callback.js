module.exports = (req, res) => {
    console.log(req)
    res.json({
      body: req.body,
      query: req,
      cookies: req.cookies,
      status: 200
    });
  };