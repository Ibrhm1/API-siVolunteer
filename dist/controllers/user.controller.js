"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importStar(require("../models/user.model"));
const encryption_1 = require("../utils/encryption");
const response_1 = __importDefault(require("../utils/response"));
const mongoose_1 = require("mongoose");
const constant_1 = require("../utils/constant");
exports.default = {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, username, email, password, confirmPassword, address, phone, } = req.body;
            try {
                yield user_model_1.userDTO.validate({
                    fullName,
                    username,
                    email,
                    password,
                    confirmPassword,
                    address,
                    phone,
                });
                const user = yield user_model_1.default.create({
                    fullName,
                    username,
                    email,
                    password,
                    address,
                    phone,
                });
                response_1.default.success(res, user, 'Success registration');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit = 10, page = 1 } = req.query;
                const result = yield user_model_1.default.find({ role: constant_1.ROLES.MEMBER })
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1 })
                    .exec();
                const count = yield user_model_1.default.countDocuments({ role: 'member' });
                response_1.default.pagination(res, result, {
                    current: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }, 'Success get users');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'User not found');
                const result = yield user_model_1.default.findById(id);
                if (!result)
                    return response_1.default.error(res, result, 'User not found');
                response_1.default.success(res, result, 'Success get user by id');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return response_1.default.notFound(res, 'User not found');
                const { fullName, profilePicture, phone, address } = req.body;
                const result = yield user_model_1.default.findByIdAndUpdate(userId, {
                    fullName,
                    profilePicture,
                    phone,
                    address,
                }, {
                    new: true,
                });
                if (!result) {
                    return response_1.default.notFound(res, 'User not found');
                }
                else {
                    return response_1.default.success(res, result, 'Success update profile');
                }
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return response_1.default.notFound(res, 'User not found');
                const { oldPassword, password, confirmPassword } = req.body;
                yield user_model_1.userUpdatePasswordDTO.validate({
                    oldPassword,
                    password,
                    confirmPassword,
                });
                const user = yield user_model_1.default.findById(userId);
                if (!user || user.password !== (0, encryption_1.encrypt)(oldPassword))
                    return response_1.default.notFound(res, 'User not found');
                const result = yield user_model_1.default.findByIdAndUpdate(userId, {
                    password: (0, encryption_1.encrypt)(password),
                }, { new: true });
                response_1.default.success(res, result, 'Success update password');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
