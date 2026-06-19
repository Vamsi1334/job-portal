const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const { Employee } = require('../models');
const { HTTP_STATUS } = require('../constants');

const readRefreshCookie = (req) => (req.cookies ? req.cookies[tokenService.REFRESH_COOKIE] : null);

const register = asyncHandler(async (req, res) => {
  const { employee, devCode } = await authService.register(req.body, req);

  const body = {
    status: 'success',
    message: devCode
      ? 'Account created. Check your email for the verification code.'
      : 'Account created. Please sign in.',
    data: { employee },
  };
  if (devCode) body.devCode = devCode;
  return res.status(HTTP_STATUS.CREATED).json(body);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { employee, tokens } = await authService.verifyOtp(req.body, req);
  tokenService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Verification successful',
    data: { employee, accessToken: tokens.accessToken },
  });
});

const login = asyncHandler(async (req, res) => {
  const { employee, tokens } = await authService.login(req.body, req);
  tokenService.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Logged in',
    data: { employee, accessToken: tokens.accessToken },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await authService.refresh(readRefreshCookie(req), req);
  tokenService.setAuthCookies(res, accessToken, refreshToken);
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Token refreshed',
    data: { accessToken },
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(readRefreshCookie(req), req);
  tokenService.clearAuthCookies(res);
  res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Logged out' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { devCode } = await authService.forgotPassword(req.body, req);
  const body = {
    status: 'success',
    message: 'If an account exists for that email, a reset code has been sent.',
  };
  if (devCode) body.devCode = devCode;
  res.status(HTTP_STATUS.OK).json(body);
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body, req);
  res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Password reset. Please log in.' });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(req.user.id, req.body.password, req);
  tokenService.clearAuthCookies(res);
  res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Account deleted' });
});

const updateMe = asyncHandler(async (req, res) => {
  const employee = await authService.updateProfile(req.user.id, req.body, req);
  res.status(HTTP_STATUS.OK).json({
    status: 'success',
    message: 'Profile updated',
    data: { employee },
  });
});

const me = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.user.id);
  if (!employee) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ status: 'fail', message: 'Account not found' });
  }
  return res.status(HTTP_STATUS.OK).json({ status: 'success', data: { employee } });
});

module.exports = {
  register,
  verifyOtp,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  updateMe,
  deleteAccount,
  me,
};
