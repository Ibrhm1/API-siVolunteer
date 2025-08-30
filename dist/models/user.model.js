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
exports.userUpdatePasswordDTO = exports.userLoginDTO = exports.userDTO = exports.USER_MODEL_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const encryption_1 = require("../utils/encryption");
const mail_1 = require("../utils/mails/mail");
const env_1 = require("../utils/env");
const constant_1 = require("../utils/constant");
const Yup = __importStar(require("yup"));
const Schema = mongoose_1.default.Schema;
exports.USER_MODEL_NAME = 'User';
const validatePassword = Yup.string()
    .required()
    .min(6, 'Password must be at least 6 characters')
    .test('at least one uppercase', 'Password must contain at least one uppercase letter', (value) => /[A-Z]/.test(value || ''))
    .test('at least one number', 'Password must contain at least one number', (value) => /[0-9]/.test(value || ''));
const validateConfirmPassword = Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ''], "Password doesn't match");
exports.userDTO = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
    phone: Yup.string(),
    address: Yup.string(),
});
exports.userLoginDTO = Yup.object({
    identifier: Yup.string().required(),
    password: validatePassword,
});
exports.userUpdatePasswordDTO = Yup.object({
    oldPassword: validatePassword,
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
});
const UserSchema = new Schema({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    phone: {
        type: Schema.Types.String,
    },
    address: {
        type: Schema.Types.String,
        required: true,
    },
    profilePicture: {
        type: Schema.Types.String,
        default: 'profile.png',
    },
    role: {
        type: Schema.Types.String,
        enum: [constant_1.ROLES.ADMIN, constant_1.ROLES.MEMBER],
        default: constant_1.ROLES.MEMBER,
    },
    active: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type: Schema.Types.String,
    },
}, {
    timestamps: true,
});
UserSchema.pre('save', function (next) {
    const user = this;
    user.password = (0, encryption_1.encrypt)(user.password);
    user.activationCode = (0, encryption_1.encrypt)(user.id);
    next();
});
UserSchema.post('save', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = doc;
            const contentMail = yield (0, mail_1.renderMailHtml)('registration-succes.ejs', {
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                activationLink: `${env_1.CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
            });
            yield (0, mail_1.sendMail)({
                from: env_1.EMAIL_SMTP_USER,
                to: user.email,
                subject: 'Activation account',
                html: contentMail,
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            next();
        }
    });
});
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
const UserModel = mongoose_1.default.model(exports.USER_MODEL_NAME, UserSchema);
exports.default = UserModel;
