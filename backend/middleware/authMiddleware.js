const jwt =
  require("jsonwebtoken");

function getCookie(
  req,
  name
) {
  const cookieHeader =
    req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies =
    cookieHeader.split(";");

  for (
    const cookie of cookies
  ) {
    const [
      cookieName,
      ...cookieValue
    ] =
      cookie
        .trim()
        .split("=");

    if (
      cookieName === name
    ) {
      return decodeURIComponent(
        cookieValue.join("=")
      );
    }
  }

  return null;
}

function authenticate(
  req,
  res
) {
  const accessToken =
    getCookie(
      req,
      "accessToken"
    );

  if (!accessToken) {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Authentication required"
      })
    );

    return false;
  }

  try {
    const decoded =
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

    req.user =
      decoded;

    return true;

  } catch {
    res.writeHead(401, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        message:
          "Invalid or expired access token"
      })
    );

    return false;
  }
}

module.exports =
  authenticate;