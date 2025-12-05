import User from "../../model/user/index.js";
import generateToken from '../../middleware/token.js'
import sendEmail from "../../middleware/email/sendEmail.js";
import { emailTemplatesForInterview } from "../../middleware/email/templates.js";
import Visitor from "../../model/visitor/index.js";

const getUserData = async (_req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserDataById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
       return res.status(400).json({ message: 'Email and password are required' });
   }
   const user = await User.findOne({ email });
   if (!user) {
       return res.status(400).json({ message: 'User not found' });
   }
   if (user.password !== password) {
       return res.status(400).json({ message: 'Invalid password' });
   }
   else {
       const token = generateToken(user);
       user.token = token;
       await user.save();
       const safeUser = user.toObject();
       delete safeUser.password;        


       res.json({ message: 'Login successful', user: safeUser });
   }
};

const signUpUser= async (req,res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
    res.status(500).json({ message: error.message });
    }
}

const forgotUserEmail = async (req, res) => {
    const { email ,phoneNumber } = req.body;
    try {
        if (email) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const template = emailTemplatesForInterview.forgotPassword(otp);
            const sendEmailResult = await sendEmail(email , template);

            res.json({ message: sendEmailResult });
        } else if (phoneNumber) {
            res.json({ message: 'Password reset link sent to your phone number' });
        } else {
            res.status(400).json({ message: 'Email or phone number is required' });
        }
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ message: 'Error sending reset email', error: error.message });
    }
};

const visitor = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // check if visitor already exists
        let visitor = await Visitor.findOne({ email });

        const template = emailTemplatesForInterview.visitor(email);

        if (!visitor) {
            // NEW USER
            visitor = new Visitor({ email, attemptCount: 1 });
            await visitor.save();

            await sendEmail(email, template);

            return res.status(201).json({
                message: "Visitor created successfully (1/3 attempts)",
                visitor,
                statusCode: 201
            });
        }

        // EXISTING USER -> check attempts
        if (visitor.attemptCount >= 3) {
            return res.status(429).json({
                message: "Maximum attempts reached. Try again later.",
                attemptsUsed: visitor.attemptCount,
                statusCode: 429
            });
        }

        // ALLOWED: increase count + send email
        visitor.attemptCount += 1;
        await visitor.save();

        await sendEmail(email, template);

        return res.status(200).json({
            message: `Email sent successfully (${visitor.attemptCount}/3 attempts)`,
            visitor,
            statusCode: 200
        });

    } catch (error) {
        console.error("Visitor Error:", error);
        return res.status(500).json({ message: error.message, statusCode: 500 });
    }
};

const interviewer = async(req,res) => {
    try {
        const { email } = req.body;
        const userOne = await User.findOne({ email });
        const meetingDate = new Date().toISOString().split('T')[0];
        const template = emailTemplatesForInterview.interviewer(email,meetingDate,userOne.name);
        const sendEmailResult = await sendEmail(email , template);
        res.json({ message: sendEmailResult });
        
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ message: 'Error sending reset email', error: error.message });
    }
}




export { getUserData, getUserDataById, loginUser, signUpUser, forgotUserEmail, visitor ,interviewer };