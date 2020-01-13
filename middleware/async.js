//try catch blocks for route handlers :)

module.exports = function(routeHandler) {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
