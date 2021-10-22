module.exports = (req, res) => {
    res.json({
      body: req.body,
      query: req.query,
      cookies: req.cookies,
    });
    window.location.replace("staking.pruf.io/#/stake"+req.query)
  };