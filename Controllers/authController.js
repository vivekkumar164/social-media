import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'






//registering new user
export const registerUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword
    const newUser = new userModel(req.body);
    const { userName } = req.body;
    try {
        const oldUser = await userModel.findOne({ userName });
        if (oldUser) {
            return res.status(400).json({ "message": "username already registered" })
        }
        const user = await newUser.save();

        const token = jwt.sign({
            username: user.username, id: user._id
        }, process.env.JWT_KEY, { expiresIn: '1h' })

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//login a user

export const logInUser = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await userModel.findOne({ userName: userName });
        if (user) {
            const validity = await bcrypt.compare(password, user.password);
            //validity ? res.status(200).json(user) : res.status(400).json({message:'Wrong password'})
            if (!validity) {
                res.status(400).json("wrong password")
            } else {
                const token = jwt.sign({
                    username: user.username, id: user._id
                }, process.env.JWT_KEY, { expiresIn: '1h' })

                res.status(200).json({user,token});
            }
        } else {
            res.status(404).json({ message: 'User does not exists.' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


