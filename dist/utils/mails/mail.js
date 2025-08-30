"use strict";
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
exports.renderMailHtml = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../env");
//* konfigure nodemailer
const transporter = nodemailer_1.default.createTransport({
    service: env_1.EMAIL_SMTP_SERVICE_NAME,
    host: env_1.EMAIL_SMTP_HOST,
    port: env_1.EMAIL_SMTP_PORT,
    secure: env_1.EMAIL_SMTP_SECURE,
    auth: {
        user: env_1.EMAIL_SMTP_USER,
        pass: env_1.EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});
//* function send email
//! params sendMail = ...mailParams
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ from, to, subject, html }) {
    const result = yield transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
    return result;
});
exports.sendMail = sendMail;
const renderMailHtml = (template, data) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `templates/${template}`), data);
    return content;
});
exports.renderMailHtml = renderMailHtml;
