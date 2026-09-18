const adminController =
  require(
    "../controllers/adminController"
  );

const authenticate =
  require(
    "../middleware/authMiddleware"
  );

const authorizeAdmin =
  require(
    "../middleware/adminMiddleware"
  );

async function adminRoutes(
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
    !pathname.startsWith(
      "/admin"
    )
  ) {
    return false;
  }

  const authenticated =
    authenticate(
      req,
      res
    );

  if (!authenticated) {
    return true;
  }

  const authorized =
    authorizeAdmin(
      req,
      res
    );

  if (!authorized) {
    return true;
  }

  if (
    req.method === "GET" &&
    pathname === "/admin/users"
  ) {
    await adminController.getUsers(
      req,
      res
    );

    return true;
  }

  const roleMatch =
    pathname.match(
      /^\/admin\/users\/([^/]+)\/role$/
    );

  if (
    req.method === "PUT" &&
    roleMatch
  ) {
    const id =
      decodeURIComponent(
        roleMatch[1]
      );

    await adminController.updateRole(
      req,
      res,
      id
    );

    return true;
  }

  const userMatch =
    pathname.match(
      /^\/admin\/users\/([^/]+)$/
    );

  if (
    req.method === "DELETE" &&
    userMatch
  ) {
    const id =
      decodeURIComponent(
        userMatch[1]
      );

    await adminController.deleteUser(
      req,
      res,
      id
    );

    return true;
  }

  return false;
}

module.exports =
  adminRoutes;