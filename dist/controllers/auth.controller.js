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
const jwt_1 = require("../utils/jwt");
const response_1 = __importDefault(require("../utils/response"));
const organizers_model_1 = __importDefault(require("../models/organizers.model"));
exports.default = {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, password } = req.body;
                yield user_model_1.userLoginDTO.validate({ identifier, password });
                const user = yield user_model_1.default.findOne({
                    $or: [{ email: identifier }, { username: identifier }],
                    active: true,
                });
                if (user) {
                    const isPasswordValid = (0, encryption_1.encrypt)(password) === user.password;
                    if (!isPasswordValid)
                        return response_1.default.unauthorized(res, 'Invalid password');
                    const token = (0, jwt_1.generateToken)({
                        id: user._id,
                        role: user.role,
                    });
                    return response_1.default.success(res, token, 'Success login as user!');
                }
                const organizer = yield organizers_model_1.default.findOne({
                    $or: [{ email: identifier }, { organizerName: identifier }],
                    active: true,
                });
                if (!organizer) {
                    return response_1.default.notFound(res, 'Account not found');
                }
                const isPasswordValid = (0, encryption_1.encrypt)(password) === organizer.password;
                if (!isPasswordValid)
                    return response_1.default.unauthorized(res, 'Invalid password');
                const token = (0, jwt_1.generateToken)({
                    id: organizer._id,
                    role: organizer.role,
                });
                return response_1.default.success(res, token, 'Success login as organizer!');
            }
            catch (error) {
                const err = error;
                return response_1.default.error(res, error, err.message);
            }
        });
    },
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if ((user === null || user === void 0 ? void 0 : user.role) === 'member' || (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
                    const result = yield user_model_1.default.findById(user.id);
                    if (!result)
                        return response_1.default.notFound(res, 'User not found');
                    response_1.default.success(res, result, 'Success get profile user');
                }
                if ((user === null || user === void 0 ? void 0 : user.role) === 'organizer') {
                    const result = yield organizers_model_1.default.findById(user.id);
                    if (!result)
                        return response_1.default.notFound(res, 'Organizer not found');
                    response_1.default.success(res, result, 'Success get profile organizer');
                }
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    activation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.body;
                const user = yield user_model_1.default.findOneAndUpdate({
                    activationCode: code,
                }, {
                    active: true,
                }, {
                    new: true,
                });
                if (user)
                    return response_1.default.success(res, user, 'User account activated successfully');
                const organizer = yield organizers_model_1.default.findOneAndUpdate({
                    activationCode: code,
                }, { active: true }, { new: true });
                if (organizer)
                    return response_1.default.success(res, organizer, 'Organizer account activated successfully');
                return response_1.default.notFound(res, 'Activation code not found');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
