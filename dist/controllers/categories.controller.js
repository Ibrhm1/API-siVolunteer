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
const response_1 = __importDefault(require("../utils/response"));
const categories_model_1 = __importStar(require("../models/categories.model"));
const mongoose_1 = require("mongoose");
const uploader_1 = __importDefault(require("../utils/uploader"));
exports.default = {
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield categories_model_1.categoryDAO.validate(req.body);
                const result = yield categories_model_1.default.create(req.body);
                response_1.default.success(res, result, 'Success create category');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 10, page = 1, search, } = req.query;
            try {
                const query = {};
                if (search) {
                    Object.assign(query, Object.assign(Object.assign({}, query), { $text: { $search: search } }));
                }
                const result = yield categories_model_1.default.find(query)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1 })
                    .exec();
                const count = yield categories_model_1.default.countDocuments(query);
                response_1.default.pagination(res, result, {
                    current: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }, 'Success get category');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Category not found');
                const result = yield categories_model_1.default.findById(id);
                if (!result)
                    return response_1.default.notFound(res, 'Category not found');
                response_1.default.success(res, result, 'Success get category');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, image, description } = req.body;
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Category not found');
                const result = yield categories_model_1.default.findByIdAndUpdate(id, { name, image, description }, {
                    new: true,
                });
                if (!result)
                    return response_1.default.notFound(res, 'Category not found');
                response_1.default.success(res, result, 'Success update category');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Category not found');
                const result = yield categories_model_1.default.findByIdAndDelete(id, { new: true });
                if (!result)
                    return response_1.default.notFound(res, 'Category not found');
                yield uploader_1.default.remove(result === null || result === void 0 ? void 0 : result.image);
                response_1.default.success(res, result, 'Success delete category');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
