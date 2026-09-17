const authController =
  require(
    "../controllers/authController"
  );

const authenticate =
  require(
    "../middleware/authMiddleware"
  );

async function authRoutes(
  req,
  res
) {
  const url =
    new URL(
      req.url,
      `http://${req.headers.host}`
    );

  const pathname =
    url.pathname;

  if (
    req.method === "POST" &&
    pathname === "/register"
  ) {
    await authController.register(
      req,
      res
    );

    return true;
  }

  if (
    req.method === "POST" &&
    pathname === "/login"
  ) {
    await authController.login(
      req,
      res
    );

    return true;
  }

  if (
    req.method === "POST" &&
    pathname === "/refresh"
  ) {
    authController.refresh(
      req,
      res
    );

    return true;
  }

  if (
    req.method === "POST" &&
    pathname === "/logout"
  ) {
    authController.logout(
      req,
      res
    );

    return true;
  }

  if (
    req.method === "GET" &&
    pathname === "/session"
  ) {
    const authenticated =
      authenticate(
        req,
        res
      );

    if (!authenticated) {
      return true;
    }

    authController.session(
      req,
      res
    );

    return true;
  }

  return false;
}

module.exports =
  authRoutes;