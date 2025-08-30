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
const eventVolunteer_model_1 = __importStar(require("../models/eventVolunteer.model"));
const mongoose_1 = require("mongoose");
const events_model_1 = __importDefault(require("../models/events.model"));
exports.default = {
    createEventVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { eventId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(eventId))
                    return response_1.default.notFound(res, 'Event not found');
                //* ambil event berdasarkan id yang dipilih
                const event = yield events_model_1.default.findById(eventId);
                if (!event)
                    return response_1.default.notFound(res, 'Event not found');
                //* cek current volunteer
                const currentCount = Array.isArray(event.currentVolunteers)
                    ? event.currentVolunteers.length
                    : 0;
                //* cek apakah event sudah penuh
                if (currentCount >= event.requiredVolunteers)
                    return response_1.default.conflict(res, 'Event is full');
                //* cek apakah sudah mendaftar
                const exiting = yield eventVolunteer_model_1.default.findOne({
                    eventId,
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                });
                if (exiting)
                    return response_1.default.conflict(res, 'You are already registered');
                const payload = Object.assign(Object.assign({}, req.body), { eventId: eventId, userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id });
                yield eventVolunteer_model_1.eventVolunteerDAO.validate(payload);
                yield events_model_1.default.findByIdAndUpdate(eventId, {
                    $addToSet: { currentVolunteers: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id },
                }, { new: true });
                const result = yield eventVolunteer_model_1.default.create(payload);
                if (!result)
                    return response_1.default.notFound(res, 'EventVolunteer not found');
                response_1.default.success(res, result, 'Success create eventVolunteer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getAllEventVolunteers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buildQuery = (filter) => {
                    let query = {};
                    if (filter.eventId)
                        query.eventId = filter.eventId;
                    if (filter.userId)
                        query.userId = filter.userId;
                    return query;
                };
                const { limit = 10, page = 1, eventId, userId } = req.query;
                const query = buildQuery({ eventId, userId });
                const result = yield eventVolunteer_model_1.default.find(query)
                    .limit(+limit)
                    .skip((+page - 1) * +limit)
                    .sort({ createdAt: -1 })
                    .lean()
                    .exec();
                const count = yield eventVolunteer_model_1.default.countDocuments(query);
                response_1.default.pagination(res, result, {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                }, 'Success get eventVolunteers');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getEventVolunteerByMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { limit = 10, page = 1 } = req.query;
            const query = {};
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield eventVolunteer_model_1.default.find(Object.assign({ userId }, query))
                    .limit(+limit)
                    .skip((+page - 1) * +limit)
                    .sort({ createdAt: -1 })
                    .exec();
                const count = yield eventVolunteer_model_1.default.countDocuments(query);
                response_1.default.pagination(res, result, {
                    current: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }, 'Success get eventVolunteer by member');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    getEventVolunteerByEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(eventId))
                    return response_1.default.notFound(res, 'Id is not valid');
                const result = yield eventVolunteer_model_1.default.find({ eventId });
                if (!result)
                    return response_1.default.notFound(res, 'Event Volunteer not found');
                response_1.default.success(res, result, 'Success get eventVolunteer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    updateStatusEventVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventVolunteerId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(eventVolunteerId))
                    return response_1.default.notFound(res, 'EventVolunteer not found');
                const result = yield eventVolunteer_model_1.default.findByIdAndUpdate(eventVolunteerId, { status: req.body.status }, { new: true });
                if (!result)
                    return response_1.default.notFound(res, 'EventVolunteer not found');
                response_1.default.success(res, result, 'Success update eventVolunteer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
    deleteEventVolunteer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventVolunteerId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(eventVolunteerId))
                    return response_1.default.notFound(res, 'Id is not valid');
                const volunteer = yield eventVolunteer_model_1.default.findById(eventVolunteerId);
                if (!volunteer)
                    return response_1.default.notFound(res, 'Event Volunteer not found');
                yield events_model_1.default.findByIdAndUpdate(volunteer.eventId, {
                    $pull: { currentVolunteers: volunteer.userId },
                }, { new: true });
                const result = yield eventVolunteer_model_1.default.findByIdAndDelete(eventVolunteerId, { new: true });
                response_1.default.success(res, result, 'Success delete eventVolunteer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
