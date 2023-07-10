const {
    createUser,
    authenticateUser,
    findAllUsers,
    findSingleUser,
    updateUser,
    deleteUser,
} = require("../model/user.model");
const { createToken } = require("../lib/security/token");

async function httpCreateUser(req, res, next) {
    try {
        const userData = req.body;
        const newUser = await createUser(userData);
        res.json(newUser);
    } catch (error) {
        next(error);
    }
}

async function httpAuthenticateUser(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await authenticateUser(username, password);

        if (!user) {
            const error = new Error("Invalid username or password");
            error.statusCode = 400;
            throw error;
        }
        const token = await createToken(
            {
                username: user.username,
                password: user.password,
                role: user.role,
            },
            "token-secret"
        );
        res.json({ user, token });
    } catch (error) {
        next(error);
    }
}

async function httpGetAllUsers(req, res) {
    const users = await findAllUsers();
    res.json(users);
}

async function httpGetSingleUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await findSingleUser(id);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function httpUpdateUser(req, res, next) {
    try {
        const { id } = req.params;
        const updatedUser = await updateUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}

async function httpDeleteUser(req, res, next) {
    try {
        const { id } = req.params;
        await deleteUser(id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    httpCreateUser,
    httpAuthenticateUser,
    httpGetAllUsers,
    httpGetSingleUser,
    httpUpdateUser,
    httpDeleteUser,
};
