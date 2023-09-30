module.exports = {
  404: (req, res, next) => {
    const err = new Error(`Resource not found`);
    err.status = 404;
    next(err);
  },
};
