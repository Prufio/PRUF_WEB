module.exports = (req, res) => {
    const { name = 'World' } = req.query;
    console.log(req.query)
    res.status(200).send(`Hello ${name}!`);
    window.location.href="staking.pruf.io"
  };