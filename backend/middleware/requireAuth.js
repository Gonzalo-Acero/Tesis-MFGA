import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const secret = getJwtSecret();
  if (!secret) {
    return res
      .status(500)
      .json({ message: "JWT_SECRET no configurado en el servidor" });
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token de autenticacion requerido" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (error) {
    console.error("Token invalido:", error);
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
};

export { requireAuth };
