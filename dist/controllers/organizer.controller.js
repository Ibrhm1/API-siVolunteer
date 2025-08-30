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
const organizers_model_1 = __importStar(require("../models/organizers.model"));
const encryption_1 = require("../utils/encryption");
const mongoose_1 = require("mongoose");
exports.default = {
    registerOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organizerName, email, password, confirmPassword, contactPerson, phone, dateEstablished, descriptionOrganizer, location, logo, } = req.body;
            try {
                yield organizers_model_1.organizerDTO.validate({
                    organizerName,
                    email,
                    password,
                    confirmPassword,
                    contactPerson,
                    phone,
                    descriptionOrganizer,
                    dateEstablished,
                    location,
                    logo,
                });
                const organizer = yield organizers_model_1.default.create({
                    organizerName,
                    email,
                    password,
                    contactPerson,
                    phone,
                    descriptionOrganizer,
                    dateEstablished,
                    location,
                    logo,
                });
                response_1.default.success(res, organizer, 'Success registration');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updateProfileOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const organizerId = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
                if (!organizerId)
                    return response_1.default.notFound(res, 'Organizer not found');
                const { organizerName, contactPerson, phone, descriptionOrganizer, dateEstablished, logo, location, } = req.body;
                const payload = {
                    organizerName,
                    contactPerson,
                    phone,
                    descriptionOrganizer,
                    dateEstablished,
                    logo,
                    'location.domicile': location === null || location === void 0 ? void 0 : location.domicile,
                    'location.address': location === null || location === void 0 ? void 0 : location.address,
                };
                const result = yield organizers_model_1.default.findByIdAndUpdate(organizerId, { $set: payload }, { new: true });
                if (!result)
                    return response_1.default.notFound(res, 'Organizer not found');
                response_1.default.success(res, result, 'Success update profile');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updatePasswordOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const organizerId = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
                if (!organizerId)
                    return response_1.default.notFound(res, 'Organizer not found');
                const { oldPassword, password, confirmPassword } = req.body;
                yield organizers_model_1.organizerUpdatePasswordDTO.validate({
                    oldPassword,
                    password,
                    confirmPassword,
                });
                const organizer = yield organizers_model_1.default.findById(organizerId);
                if (!organizer || organizer.password !== (0, encryption_1.encrypt)(oldPassword))
                    return response_1.default.notFound(res, 'User not found');
                const result = yield organizers_model_1.default.findByIdAndUpdate(organizerId, {
                    password: (0, encryption_1.encrypt)(password),
                }, { new: true });
                response_1.default.success(res, result, 'Success update password');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getAllOrganizers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 10, page = 1, search, } = req.query;
            try {
                const query = {};
                if (search) {
                    Object.assign(query, Object.assign(Object.assign({}, query), { $text: { $search: search } }));
                }
                const result = yield organizers_model_1.default.find(query)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1 })
                    .exec();
                const count = yield organizers_model_1.default.countDocuments(query);
                response_1.default.pagination(res, result, {
                    current: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }, 'Success get all organizers');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getOrganizerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { organizerId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(organizerId))
                    return response_1.default.notFound(res, 'Id is invalid');
                const result = yield organizers_model_1.default.findById(organizerId);
                if (!result)
                    return response_1.default.notFound(res, 'Organizer not found');
                response_1.default.success(res, result, 'Success get organizer by id');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    deleteOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { organizerId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(organizerId))
                    return response_1.default.notFound(res, 'Id is invalid');
                const result = yield organizers_model_1.default.findByIdAndDelete(organizerId, {
                    new: true,
                });
                if (!result)
                    return response_1.default.notFound(res, 'Organizer not found');
                response_1.default.success(res, result, 'Success delete organizer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
