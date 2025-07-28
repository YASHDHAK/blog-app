"use strict";
// import User from "../model/User.js";
// import jwt from "jsonwebtoken";
// import TryCatch from "../utils/TryCatch.js";
// import { AuthenticatedRequest } from "../middleware/isAuth.js";
// import getBuffer from "../utils/dataUri.js";
// import { v2 as cloudinary } from "cloudinary";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePic = exports.updateUser = exports.getUserProfile = exports.myProfile = exports.loginUser = void 0;
// export const loginUser = TryCatch(async(req,res) => {
//  const { email, name, image } = req.body;
//   let user = await User.findOne({ email });
//   if (!user) {
//     user = await User.create({
//       name,
//       email,
//       image: image,
//     });
//   }
//    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
//     expiresIn: "5d",
//   });
//   res.status(200).json({
//     message: "Login success",
//     token,
//     user,
//   });
// });
// export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
//   const user = req.user;
//   res.json(user);
// });
// export const getUserProfile = TryCatch(async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     res.status(404).json({
//       message: "No user with this id",
//     });
//     return;
//   }
//   res.json(user);
// });
// export const updateUser = TryCatch(async (req: AuthenticatedRequest, res) => {
//   const { name, instagram, facebook, linkedin, bio } = req.body;
//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       name,
//       instagram,
//       facebook,
//       linkedin,
//       bio,
//     },
//     { new: true }
//   );
//   const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
//     expiresIn: "5d",
//   });
//   res.json({
//     message: "User Updated",
//     token,
//     user,
//   });
// });
// export const updateProfilePic = TryCatch(
//   async (req: AuthenticatedRequest, res) => {
//     const file = req.file;
//     if (!file) {
//       res.status(400).json({
//         message: "No file to upload",
//       });
//       return;
//     }
//     const fileBuffer = getBuffer(file);
//     if (!fileBuffer || !fileBuffer.content) {
//       res.status(400).json({
//         message: "Failed to generate buffer",
//       });
//       return;
//     }
//     const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
//       folder: "blogs",
//     });
//     const user = await User.findByIdAndUpdate(
//       req.user?._id,
//       {
//         image: cloud.secure_url,
//       },
//       { new: true }
//     );
//     const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
//       expiresIn: "5d",
//     });
//     res.json({
//       message: "User Profile pic updated",
//       token,
//       user,
//     });
//   }
// );
const User_js_1 = __importDefault(require("../model/User.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TryCatch_js_1 = __importDefault(require("../utils/TryCatch.js"));
const dataUri_js_1 = __importDefault(require("../utils/dataUri.js"));
const cloudinary_1 = require("cloudinary");
const GoogleConfig_js_1 = require("../utils/GoogleConfig.js");
const axios_1 = __importDefault(require("axios"));
exports.loginUser = (0, TryCatch_js_1.default)(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({
            message: "Authorization code is required",
        });
        return;
    }
    //console.log("code",code);
    const googleRes = await GoogleConfig_js_1.oauth2client.getToken(code);
    //console.log("googleRes",googleRes);
    GoogleConfig_js_1.oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    //console.log("userRes",userRes);
    const { email, name, picture } = userRes.data;
    let user = await User_js_1.default.findOne({ email });
    if (!user) {
        user = await User_js_1.default.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.status(200).json({
        message: "Login success",
        token,
        user,
    });
});
exports.myProfile = (0, TryCatch_js_1.default)(async (req, res) => {
    const user = req.user;
    res.json(user);
});
exports.getUserProfile = (0, TryCatch_js_1.default)(async (req, res) => {
    const user = await User_js_1.default.findById(req.params.id);
    if (!user) {
        res.status(404).json({
            message: "No user with this id",
        });
        return;
    }
    res.json(user);
});
exports.updateUser = (0, TryCatch_js_1.default)(async (req, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const user = await User_js_1.default.findByIdAndUpdate(req.user?._id, {
        name,
        instagram,
        facebook,
        linkedin,
        bio,
    }, { new: true });
    const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.json({
        message: "User Updated",
        token,
        user,
    });
});
exports.updateProfilePic = (0, TryCatch_js_1.default)(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = (0, dataUri_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed to generate buffer",
        });
        return;
    }
    const cloud = await cloudinary_1.v2.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });
    const user = await User_js_1.default.findByIdAndUpdate(req.user?._id, {
        image: cloud.secure_url,
    }, { new: true });
    const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.json({
        message: "User Profile pic updated",
        token,
        user,
    });
});
