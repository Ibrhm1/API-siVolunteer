"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizerData = exports.getUserData = exports.generateTokenOrganizer = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const generateToken = (user) => {
    const token = jsonwebtoken_1.default.sign(user, env_1.SECRET, {
        expiresIn: '1h',
    });
    return token;
};
exports.generateToken = generateToken;
const generateTokenOrganizer = (organizer) => {
    const token = jsonwebtoken_1.default.sign(organizer, env_1.SECRET, {
        expiresIn: '1h',
    });
    return token;
};
exports.generateTokenOrganizer = generateTokenOrganizer;
const getUserData = (token) => {
    const user = jsonwebtoken_1.default.verify(token, env_1.SECRET);
    return user;
};
exports.getUserData = getUserData;
const getOrganizerData = (token) => {
    const organizer = jsonwebtoken_1.default.verify(token, env_1.SECRET);
    return organizer;
};
exports.getOrganizerData = getOrganizerData;
