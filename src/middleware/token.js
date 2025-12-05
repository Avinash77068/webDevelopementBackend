import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    // Token creation logic goes here
    const userId = payload._id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // In a real implementation, you would use a JWT library here
    return token;
};

export default generateToken;