class AuthController {
  static getProfile = async ({ user }, res, next) => {
    try {
      res.status(200).json(user);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default AuthController;
