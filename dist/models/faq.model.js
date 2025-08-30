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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqDAO = exports.FAQ_MODEL_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Yup = __importStar(require("yup"));
const constant_1 = require("../utils/constant");
const Schema = mongoose_1.default.Schema;
exports.FAQ_MODEL_NAME = 'FaQ';
exports.faqDAO = Yup.object({
    question: Yup.string().required(),
    answer: Yup.string().required(),
    type: Yup.string().oneOf([constant_1.TYPE.MEMBER, constant_1.TYPE.ORGANIZER]).required(),
    isPublish: Yup.boolean().required(),
});
const faqSchema = new Schema({
    question: {
        type: Schema.Types.String,
        required: true,
    },
    answer: {
        type: Schema.Types.String,
        required: true,
    },
    type: {
        type: Schema.Types.String,
        required: true,
    },
    isPublish: {
        type: Schema.Types.Boolean,
        required: true,
    },
}, {
    timestamps: true,
}).index({ type: 'text' });
const FaqModel = mongoose_1.default.model(exports.FAQ_MODEL_NAME, faqSchema);
exports.default = FaqModel;
