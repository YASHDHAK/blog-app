"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const isAuth_1 = require("../middleware/isAuth");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/login", user_1.loginUser);
router.get("/me", isAuth_1.isAuth, user_1.myProfile);
router.get("/user/:id", user_1.getUserProfile);
router.post("/user/update", isAuth_1.isAuth, user_1.updateUser);
router.post("/user/update/pic", isAuth_1.isAuth, multer_1.default, user_1.updateProfilePic);
exports.default = router;
