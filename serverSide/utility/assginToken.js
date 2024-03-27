// Create and save assigned token
export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Set expiration time for the cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set the token as a cookie in the response
  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
  });
};
