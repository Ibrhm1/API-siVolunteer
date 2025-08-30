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
const uploader_1 = __importDefault(require("../utils/uploader"));
const response_1 = __importDefault(require("../utils/response"));
exports.default = {
    uploadSingle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file)
                return response_1.default.error(res, null, 'File is not exist');
            try {
                const result = yield uploader_1.default.uploadSingle(req.file);
                response_1.default.success(res, result, 'Success upload a file');
            }
            catch (_a) {
                response_1.default.error(res, null, 'Failed upload file');
            }
        });
    },
    deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileUrl } = req.body;
                const result = yield uploader_1.default.remove(fileUrl);
                response_1.default.success(res, result, 'Success remove file');
            }
            catch (_a) {
                response_1.default.error(res, null, 'Failed remove file');
            }
        });
    },
};
