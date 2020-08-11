const User  = require("../models/user");

module.exports = function(app) {
  app.get("/api/user/info", (req, res) => {
    User.find({"_id":req.query.userID})
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
  });
};