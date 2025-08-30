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
exports.organizerUpdatePasswordDTO = exports.organizerLoginDTO = exports.organizerDTO = exports.ORGANIZER_MODEL_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Yup = __importStar(require("yup"));
const encryption_1 = require("../utils/encryption");
const constant_1 = require("../utils/constant");
const mail_1 = require("../utils/mails/mail");
const env_1 = require("../utils/env");
const Schema = mongoose_1.default.Schema;
exports.ORGANIZER_MODEL_NAME = 'Orginizer';
const validatePasswordOrganizer = Yup.string()
    .required()
    .min(8, 'Password must be at least 6 characters')
    .test('at least one uppercase', 'Password must contain at least one uppercase letter', (value) => /[A-Z]/.test(value || ''))
    .test('at least one number', 'Password must contain at least one number', (value) => /[0-9]/.test(value || ''));
const validateConfirmPasswordOrganizer = Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ''], "Password doesn't match");
exports.organizerDTO = Yup.object({
    organizerName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: validatePasswordOrganizer,
    confirmPassword: validateConfirmPasswordOrganizer,
    contactPerson: Yup.string().required(),
    phone: Yup.string().required(),
    descriptionOrganizer: Yup.string(),
    dateEstablished: Yup.string().required(),
    location: Yup.object()
        .shape({
        domicile: Yup.string(),
        address: Yup.string(),
    })
        .required(),
});
exports.organizerLoginDTO = Yup.object({
    identifier: Yup.string().required(),
    password: validatePasswordOrganizer,
});
exports.organizerUpdatePasswordDTO = Yup.object({
    oldPassword: validatePasswordOrganizer,
    password: validatePasswordOrganizer,
    confirmPassword: validateConfirmPasswordOrganizer,
});
const OrganizerSchema = new Schema({
    organizerName: {
        type: Schema.Types.String,
        required: true,
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
    role: {
        type: Schema.Types.String,
        default: constant_1.ROLES.ORGANIZER,
    },
    contactPerson: {
        type: Schema.Types.String,
    },
    phone: {
        type: Schema.Types.String,
    },
    descriptionOrganizer: {
        type: Schema.Types.String,
    },
    dateEstablished: {
        type: Schema.Types.String,
    },
    location: {
        type: {
            domicile: {
                type: Schema.Types.String,
            },
            address: {
                type: Schema.Types.String,
            },
        },
    },
    logo: {
        type: Schema.Types.String,
        default: 'logo.png',
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
}).index({ organizerName: 'text' });
OrganizerSchema.pre('save', function (next) {
    const organizer = this;
    organizer.password = (0, encryption_1.encrypt)(organizer.password);
    organizer.activationCode = (0, encryption_1.encrypt)(organizer.id);
    next();
});
OrganizerSchema.post('save', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organizer = doc;
            const contentMail = yield (0, mail_1.renderMailHtml)('registration-organizer.ejs', {
                organizerName: organizer.organizerName,
                contactPerson: organizer.contactPerson,
                email: organizer.email,
                dateEstablished: organizer.dateEstablished,
                createdAt: organizer.createdAt,
                activationLink: `${env_1.CLIENT_HOST}/auth/activation?code=${organizer.activationCode}`,
            });
            yield (0, mail_1.sendMail)({
                from: env_1.EMAIL_SMTP_USER,
                to: organizer.email,
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
OrganizerSchema.methods.toJSON = function () {
    const organizer = this.toObject();
    delete organizer.password;
    return organizer;
};
const OrganizerModel = mongoose_1.default.model(exports.ORGANIZER_MODEL_NAME, OrganizerSchema);
exports.default = OrganizerModel;
