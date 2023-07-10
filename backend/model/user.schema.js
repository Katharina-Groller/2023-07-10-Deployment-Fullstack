const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { UserRoles } = require("../lib/security/roles");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.USER,
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            const hashedPassword = await bcrypt.hash(update.password, 10);
            this.setUpdate({ password: hashedPassword });
        } catch (error) {
            return next(error);
        }
    }

    next();
});

userSchema.methods.authenticate = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = { userSchema };
