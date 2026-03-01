import { jwtDecode } from "jwt-decode";

export default function verifyToken(token: string) {
  const user = jwtDecode(token);
  return user;
}
