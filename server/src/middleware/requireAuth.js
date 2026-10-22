function requireAuth(req, res, next) {
  // Check whether the request has an authenticated session.
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  // The user is authenticated, so allow the request to continue.
  next();
}

module.exports = requireAuth;
