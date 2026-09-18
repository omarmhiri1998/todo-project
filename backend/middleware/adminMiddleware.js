function authorizeAdmin(
  req,
  res
) {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    res.writeHead(403, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Admin access required"
      })
    );

    return false;
  }

  return true;
}

module.exports =
  authorizeAdmin;