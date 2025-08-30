"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];
const doc = {
    info: {
        version: 'v0.0.1',
        title: 'API Documentation siVolunteer',
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Local server',
        },
        {
            url: 'https://api-si-volunteer.vercel.app/api',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
        schemas: {
            LoginRequest: {
                identifier: 'rakadgt',
                password: 'Member1',
            },
            ActivationRequest: {
                code: 'activationCode',
            },
            RegisterRequest: {
                fullName: '',
                username: '',
                email: '',
                address: '',
                phone: '',
                password: '',
                confirmPassword: '',
            },
            UpdateProfileRequest: {
                fullName: '',
                phone: '',
                address: '',
                profilePicture: 'file url',
            },
            UpdatePasswordRequest: {
                oldPassword: '',
                password: '',
                confirmPassword: '',
            },
            RegisterOrganizerRequest: {
                organizerName: '',
                email: '',
                password: '',
                confirmPassword: '',
                contactPerson: '',
                descriptionOrganizer: '',
                dateEstablished: 'YYYY-MM-DD',
                phone: '',
                location: {
                    domicile: 'region id',
                    address: '',
                },
            },
            UpdateProfileOrganizerRequest: {
                organizerName: '',
                contactPerson: '',
                phone: '',
                descriptionOrganizer: '',
                logo: 'file url',
            },
            UpdatePasswordOrganizerRequest: {
                oldPassword: '',
                password: '',
                confirmPassword: '',
            },
            CreateCategoryRequest: {
                name: '',
                description: '',
                image: 'file url',
            },
            CreateEventRequest: {
                name: '',
                description: '',
                startDate: 'YYYY-MM-DD HH:mm:ss',
                endDate: 'YYYY-MM-DD HH:mm:ss',
                image: 'file Url',
                category: 'category id',
                isOnline: false,
                isPublish: true,
                location: {
                    region: 'region id',
                    address: '',
                },
                requiredVolunteers: 50,
                requirements: '',
                benefits: '',
                tags: [''],
            },
            CreateFAQRequest: {
                question: '',
                answer: '',
                type: 'organizer | member',
                isPublish: true,
            },
            CreateEventVolunteerRequest: {
                motivation: '',
                phone: '',
                email: '',
            },
            UpdateEventVolunteerRequest: {
                status: 'pending | accepted | rejected',
            },
            DeleteFileRequest: {
                fileUrl: 'File Url',
            },
        },
    },
};
(0, swagger_autogen_1.default)({
    openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
