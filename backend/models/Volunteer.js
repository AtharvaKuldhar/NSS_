import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const VolunteerSchema = new Schema({
    name : {
        type : String,
        // required : true
    },

    email : {
        type : String,
        unique : true,
        // required : true
    },

    password : {
        type : String,
        // required : true
    },

    joiningDate : {
        type : Date
    },

    credits : {
        type : Number,
        default : 0
    },

    totalActivities : {
        type : Number,
        default : 0
    },

    year : {
        type : Number
    },

    enrollmentNumber : {
        type : String
    },

})

VolunteerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

VolunteerSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

VolunteerSchema.methods.generateAccessToken = async function () {
    const payload = {
        _id: this._id,
        userType: 1,
        name: this.name,
        email: this.email,
        credits: this.credits,
        totalActivities: this.totalActivities,
        year: this.year,
        enrollmentNumber: this.enrollmentNumber
    };
    return jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};


const Volunteer = mongoose.model("Volunteer",VolunteerSchema);
export default Volunteer;