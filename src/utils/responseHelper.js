export const sendSuccess = (res, statusCode = 200, data = null, message = undefined) => {
  const response = {
    success: true,
  };

  if (message !== undefined) {
    response.message = message;
  }

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res,
  statusCode = 500,
  message = 'Internal Server Error',
  code = 'INTERNAL_ERROR'
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
