import express from 'express';
import userRouter from './routes/user/index.js'
import cors from 'cors'
import connectDB from './database/db.js';
connectDB();
// Middleware
const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 4000;


app.use(`/v1/users`, userRouter);





app.listen(port, () => {
    console.log(`Server is working fine on port http://localhost:${port}`);
});