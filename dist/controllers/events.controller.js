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
const events_model_1 = __importStar(require("../models/events.model"));
const mongoose_1 = require("mongoose");
const uploader_1 = __importDefault(require("../utils/uploader"));
exports.default = {
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const payload = Object.assign(Object.assign({}, req.body), { createdBy: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id });
                yield events_model_1.EventDAO.validate(payload);
                const result = yield events_model_1.default.create(payload);
                response_1.default.success(res, result, 'Success create event');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed');
            }
        });
    },
    getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buildQuery = (filter) => {
                    let query = {};
                    if (filter.search)
                        query.$text = { $search: filter.search };
                    if (filter.category)
                        query.category = filter.category;
                    if (filter.isOnline)
                        query.isOnline = filter.isOnline;
                    if (filter.isPublish)
                        query.isPublish = filter.isPublish;
                    return query;
                };
                const { limit = 10, page = 1, search, category, isOnline, isPublish, } = req.query;
                const query = buildQuery({
                    search,
                    category,
                    isOnline,
                    isPublish,
                });
                const result = yield events_model_1.default.find(query)
                    .limit(+limit)
                    .skip((+page - 1) * +limit)
                    .sort({ createdAt: -1 })
                    .lean()
                    .exec();
                const count = yield events_model_1.default.countDocuments(query);
                response_1.default.pagination(res, result, {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                }, 'Success get all events');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed get all events');
            }
        });
    },
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Id event not found');
                const result = yield events_model_1.default.findById(id);
                if (!result)
                    return response_1.default.notFound(res, 'Event not found');
                response_1.default.success(res, result, 'Success get event by id');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed get event by id');
            }
        });
    },
    getEventByOrganzer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { organizerId } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(organizerId))
                    return response_1.default.notFound(res, 'Organizer not found');
                const result = yield events_model_1.default.find({ createdBy: organizerId });
                if (!result)
                    return response_1.default.notFound(res, 'Event not found');
                response_1.default.success(res, result, 'Success get event by organizer');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed get event by organizer');
            }
        });
    },
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Event not found');
                const event = yield events_model_1.default.findById(id);
                if (!event)
                    return response_1.default.notFound(res, 'Event not found');
                const payload = Object.assign(Object.assign({}, req.body), { location: {
                        region: ((_a = req.body.location) === null || _a === void 0 ? void 0 : _a.region) || ((_b = event === null || event === void 0 ? void 0 : event.location) === null || _b === void 0 ? void 0 : _b.region),
                        address: ((_c = req.body.location) === null || _c === void 0 ? void 0 : _c.address) || ((_d = event === null || event === void 0 ? void 0 : event.location) === null || _d === void 0 ? void 0 : _d.address),
                    } });
                if (payload.name) {
                    const slug = payload.name.split(' ').join('-').toLowerCase();
                    payload.slug = slug;
                }
                const result = yield events_model_1.default.findByIdAndUpdate(id, payload, {
                    new: true,
                });
                response_1.default.success(res, result, 'Success update event');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed update event');
            }
        });
    },
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!(0, mongoose_1.isValidObjectId)(id))
                    return response_1.default.notFound(res, 'Event not found');
                const result = yield events_model_1.default.findByIdAndDelete(id, {
                    new: true,
                });
                if (!result)
                    return response_1.default.notFound(res, 'Event not found');
                yield uploader_1.default.remove(result === null || result === void 0 ? void 0 : result.image);
                response_1.default.success(res, result, 'Success delete event');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed delete event');
            }
        });
    },
    getEventBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const result = yield events_model_1.default.findOne({ slug });
                if (!result)
                    return response_1.default.notFound(res, 'Event not found');
                response_1.default.success(res, result, 'Success get event by slug');
            }
            catch (error) {
                response_1.default.error(res, error, 'Failed get event by slug');
            }
        });
    },
    getEventByOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { limit = 10, page = 1, search, } = req.query;
            const query = {};
            try {
                const organizerId = (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id;
                if (!organizerId)
                    return response_1.default.notFound(res, 'Organizer not found');
                if (search) {
                    Object.assign(query, Object.assign(Object.assign({}, query), { $text: { $search: search } }));
                }
                const result = yield events_model_1.default.find(Object.assign({ createdBy: organizerId }, query))
                    .limit(+limit)
                    .skip((+page - 1) * +limit)
                    .sort({ createdAt: -1 })
                    .exec();
                const count = yield events_model_1.default.countDocuments(result);
                response_1.default.pagination(res, result, {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }, 'Success get event by organizer');
            }
            catch (error) {
                const err = error;
                response_1.default.error(res, error, err.message);
            }
        });
    },
};
