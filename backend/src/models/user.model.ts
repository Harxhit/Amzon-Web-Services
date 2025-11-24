import mongoose, { Schema ,Types } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface UserDocument extends Document {
    _id: Types.ObjectId,
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  role: 'User' | 'Admin';
  refreshToken?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  createdAt: Date;
  updatedAt: Date;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}


const userSchema = new Schema<UserDocument>({
    username: {
        type : String, 
        required : [true, 'Username is required'], 
        unique : true, 
        trim : true,
        lowercase: true ,
    }, 
    firstName: {
        type: String, 
        trim: true, 
        required: [true, 'User first name is required']
    }, 
    lastName: {
        type: String, 
        trim: true, 
        required: [true, 'User last name is required']
    }, 
    email: {
        type: String, 
        required : [true , "Email is required"], 
        unique : true, 
        trim : true
    }, 
    role: {
        type: String, 
        enum : ['User' , 'Admin'], 
        default : 'User'
    }, 
    isActive: {
        type: Boolean, 
        default: false, 
    },
    password: {
        type: String, 
        required : [true , 'Password is required']
    }, 
    resetPasswordToken : {
        type : String , 
        select : false
    }, 
    refreshToken: {
        type: String, 
    }
}, {timestamps  : true})

//Hashing the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


//Method for checking if the password is correct
userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

//Generate access token
userSchema.methods.generateAccessToken = async function (): Promise<string> {
  const payLoad = {
    _id: this._id.toString(),
  };
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payLoad, secret, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES! as any,
  });
};


//Genrate refresh token
userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const payLoad = { _id: this._id as any };
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payLoad, secret, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES! as any,
  });
};

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;