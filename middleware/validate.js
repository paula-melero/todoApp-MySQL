module.exports = function(req, res, next) {
  const isNum = new RegExp(/^[0-9]*$/);
  if (isNum.test(req.params.id) === false) {
    res.status(400).json({
      errorCode: 'CastError',
      message: 'Invalid ID.'
    });
  }
  next();
};
