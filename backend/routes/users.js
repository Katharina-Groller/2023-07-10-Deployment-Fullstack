const express = require("express");
const router = express.Router();
const {
    httpCreateUser,
    httpAuthenticateUser,
    httpGetAllUsers,
    httpGetSingleUser,
    httpUpdateUser,
    httpDeleteUser,
} = require("../controller/user.controller");

const {
    authenticateToken,
    protectAdminRoute,
} = require("../middleware/userValidation");

const { userValidationRules } = require("../lib/inputValidation/userRules");
const { validationInputs } = require("../middleware/inputValidation");

/* GET users listing. */
router.get("/", authenticateToken, function (req, res, next) {
    res.send("respond with a resource");
});

router.get("/all", authenticateToken, protectAdminRoute, httpGetAllUsers);

router.post(
    "/signup",
    validationInputs(userValidationRules.signup),
    httpCreateUser
);

router.post(
    "/login",
    validationInputs(userValidationRules.login),
    httpAuthenticateUser
);

// router.use("/:id", authenticateToken);
router
    .use(authenticateToken)
    .route("/:id")
    .get(httpGetSingleUser)
    .put(httpUpdateUser)
    .delete(httpDeleteUser);

module.exports = router;
