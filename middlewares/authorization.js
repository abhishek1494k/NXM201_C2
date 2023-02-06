const authorise = (roleArr) => {

  return (req, res, next) => {
    const userrole = req.body.role;
    if (roleArr.includes(userrole)) {
      next();
    } else {
      res.json("you are nou authorised");
    }
  };
};

module.exports = { authorise };
