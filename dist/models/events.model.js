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
exports.EventDAO = exports.EVENT_MODEL_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Yup = __importStar(require("yup"));
const organizers_model_1 = require("./organizers.model");
const categories_model_1 = require("./categories.model");
const user_model_1 = require("./user.model");
exports.EVENT_MODEL_NAME = 'Event';
const Schema = mongoose_1.default.Schema;
exports.EventDAO = Yup.object({
    name: Yup.string()
        .required('Event name is required')
        .max(100, 'Event name must not be more than 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End Date Is Required'),
    image: Yup.string().required('Image is required'),
    category: Yup.string().required('Category is required'),
    isOnline: Yup.boolean().required('Online status is required'),
    isPublish: Yup.boolean().required('Publish status is required'),
    location: Yup.object().shape({
        region: Yup.number().required('Region is required'),
        address: Yup.string().required('Address is required'),
    }),
    requiredVolunteers: Yup.number()
        .required('The number of volunteers needed must be filled in')
        .min(1, 'Minimum number of volunteers is 1'),
    currentVolunteers: Yup.string(),
    requirements: Yup.string().required('Requirements are required'),
    benefits: Yup.string(),
    tags: Yup.array().of(Yup.string().max(30)).optional(),
    slug: Yup.string(),
    createdAt: Yup.string(),
    updatedAt: Yup.string(),
    createdBy: Yup.string().required(),
});
const EventSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    startDate: {
        type: Schema.Types.String,
        required: true,
    },
    endDate: {
        type: Schema.Types.String,
        required: true,
    },
    image: {
        type: Schema.Types.String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: categories_model_1.CATEGORY_MODEL_NAME,
    },
    isOnline: {
        type: Schema.Types.Boolean,
        required: true,
    },
    isPublish: {
        type: Schema.Types.Boolean,
        required: true,
    },
    location: {
        type: {
            region: {
                type: Schema.Types.Number,
            },
            address: {
                type: Schema.Types.String,
            },
        },
    },
    requiredVolunteers: {
        type: Schema.Types.Number,
        reuired: true,
    },
    currentVolunteers: [
        {
            type: Schema.Types.ObjectId,
            ref: user_model_1.USER_MODEL_NAME,
        },
    ],
    requirements: {
        type: Schema.Types.String,
        required: true,
    },
    benefits: {
        type: Schema.Types.String,
    },
    tags: {
        type: [Schema.Types.String],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: organizers_model_1.ORGANIZER_MODEL_NAME,
    },
    slug: {
        type: Schema.Types.String,
        unique: true,
    },
}, {
    timestamps: true,
}).index({ name: 'text' });
EventSchema.pre('save', function () {
    if (!this.slug) {
        const slug = this.name.split(' ').join('-').toLowerCase();
        this.slug = `${slug}`;
    }
});
const EventModel = mongoose_1.default.model(exports.EVENT_MODEL_NAME, EventSchema);
exports.default = EventModel;
