import jwt from 'jsonwebtoken';

const generateToken = (id: string, email?: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export default generateToken;
