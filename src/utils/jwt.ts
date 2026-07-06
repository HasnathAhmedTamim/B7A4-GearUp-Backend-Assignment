import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

export const createToken = (
  payload: object,
  secret: Secret,
  expiresIn: StringValue,
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } satisfies SignOptions);
};

export const verifyToken = <T>(token: string, secret: Secret) => {
  return jwt.verify(token, secret) as T;
};
