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
exports.eventVolunteerDAO = exports.EVENTVOLUNTEER_MODEL_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Yup = __importStar(require("yup"));
const constant_1 = require("../utils/constant");
const events_model_1 = require("./events.model");
const user_model_1 = require("./user.model");
exports.EVENTVOLUNTEER_MODEL_NAME = 'EventVolunteer';
const Schema = mongoose_1.default.Schema;
exports.eventVolunteerDAO = Yup.object({
    eventId: Yup.string().required(),
    userId: Yup.string().required(),
    status: Yup.string().oneOf([
        constant_1.STATUS.PENDING,
        constant_1.STATUS.ACCEPTED,
        constant_1.STATUS.REJECTED,
    ]),
    motivation: Yup.string().required(),
    phone: Yup.string().required(),
    email: Yup.string().email().required(),
    registeredAt: Yup.string(),
});
const eventVolunteerSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: events_model_1.EVENT_MODEL_NAME,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: user_model_1.USER_MODEL_NAME,
        required: true,
    },
    status: {
        type: Schema.Types.String,
        enum: [constant_1.STATUS.PENDING, constant_1.STATUS.ACCEPTED, constant_1.STATUS.REJECTED],
        default: constant_1.STATUS.PENDING,
    },
    motivation: {
        type: Schema.Types.String,
        required: true,
    },
    phone: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: false,
    },
    registeredAt: {
        type: Schema.Types.String,
        required: false,
    },
}, {
    timestamps: true,
});
const EventVolunteerModel = mongoose_1.default.model(exports.EVENTVOLUNTEER_MODEL_NAME, eventVolunteerSchema);
exports.default = EventVolunteerModel;
