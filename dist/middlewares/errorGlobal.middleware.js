"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
exports.default = {
    serverRouter() {
        return (req, res, next) => {
            response_1.default.notFound(res, 'Route not found');
        };
    },
    serverError() {
        return (err, req, res, next) => {
            response_1.default.error(res, err, err.message);
        };
    },
};
