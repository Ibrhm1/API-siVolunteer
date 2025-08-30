"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const organizer_controller_1 = __importDefault(require("../controllers/organizer.controller"));
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const acl_middleware_1 = __importDefault(require("../middlewares/acl.middleware"));
const constant_1 = require("../utils/constant");
const media_middleware_1 = __importDefault(require("../middlewares/media.middleware"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const region_controller_1 = __importDefault(require("../controllers/region.controller"));
const events_controller_1 = __importDefault(require("../controllers/events.controller"));
const faq_controller_1 = __importDefault(require("../controllers/faq.controller"));
const eventVolunteer_controller_1 = __importDefault(require("../controllers/eventVolunteer.controller"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
//* routes auth
router.post('/auth/login', auth_controller_1.default.login
/*
  #swagger.tags = ['Auth']
  #swagger.description = 'Login user and organizer'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/LoginRequest' }
      }
    }
  }
*/
);
router.post('/auth/activation', auth_controller_1.default.activation
/*
#swagger.tags = ['Auth']
#swagger.description = 'activation user and organizer'
#swagger.requestBody = {
  required: true,
  schema: {$ref: '#/components/schemas/ActivationRequest'}
  }
*/
);
router.get('/auth/get-profile', auth_middleware_1.default, auth_controller_1.default.getProfile
/*
  #swagger.tags = ['Auth']
  #swagger.description = 'get profile user and organizer'
  #swagger.security = [{ "bearerAuth": [] }]
*/
);
//* router user
router.post('/auth/register', user_controller_1.default.register
/*
  #swagger.tags = ['Users']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/RegisterRequest'}
  }
*/
);
router.get('/member', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN])], user_controller_1.default.getAllUser
/*
  #swagger.tags = ['Users']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['limit'] = {
    in: 'query',
    type: 'number',
    default: 10
  }
  #swagger.parameters['page'] = {
    in: 'query',
    type: 'number',
    default: 1
  }
*/
);
router.get('/member/:id', user_controller_1.default.getUserById
/*
  #swagger.tags = ['Users']
*/
);
router.put('/auth/update-profile', auth_middleware_1.default, user_controller_1.default.updateProfile
/*
#swagger.tags = ['Users']
#swagger.security = [{ "bearerAuth": [] }]
#swagger.requestBody = {
  required: true,
  schema: {$ref: '#/components/schemas/UpdateProfileRequest'}
  }
*/
);
router.put('/auth/update-password', auth_middleware_1.default, user_controller_1.default.updatePassword
/*
#swagger.tags = ['Users']
#swagger.security = [{ "bearerAuth": [] }]
#swagger.requestBody = {
  required: true,
  schema: {$ref: '#/components/schemas/UpdatePasswordRequest'}
  }
*/
);
//* routes organizer
router.post('/auth/register/organizers', organizer_controller_1.default.registerOrganizer
/*
  #swagger.tags = ['Organizers']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/RegisterOrganizerRequest'}
  }
*/
);
router.get('/organizers', organizer_controller_1.default.getAllOrganizers
/*
  #swagger.tags = ['Organizers']
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
 */
);
router.get('/organizers/:organizerId', organizer_controller_1.default.getOrganizerById
/*
#swagger.tags = ['Organizers']
#swagger.parameters['organizerId'] = { in: 'path', type: 'string' }
*/
);
router.put('/auth/update-profile/organizers', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ORGANIZER])], organizer_controller_1.default.updateProfileOrganizer
/*
#swagger.tags = ['Organizers']
#swagger.security = [{ "bearerAuth": [] }]
#swagger.requestBody = {
  required: true,
  schema: {$ref: '#/components/schemas/UpdateProfileOrganizerRequest'}
  }
  */
);
router.put('/auth/update-password/organizers', auth_middleware_1.default, organizer_controller_1.default.updatePasswordOrganizer
/*
#swagger.tags = ['Organizers']
#swagger.security = [{ "bearerAuth": [] }]
#swagger.requestBody = {
  required: true,
  schema: {$ref: '#/components/schemas/UpdatePasswordOrganizerRequest'}
  }
*/
);
router.delete('/organizers/:organizerId', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], organizer_controller_1.default.deleteOrganizer
/*
  #swagger.tags = ['Organizers']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.parameters['organizerId'] = { in: 'path', type: 'string' }
*/
);
//* router category
router.post('/category', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], categories_controller_1.default.createCategory
/*
  #swagger.tags = ['Category'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateCategoryRequest'}
    },
  }
*/
);
router.get('/category', categories_controller_1.default.getCategory
/*
  #swagger.tags = ['Category'],
  #swagger.parameters['limit'] = {
    in: 'query',
    type: 'number',
    default: 10
  }
  #swagger.parameters['page'] = {
    in: 'query',
    type: 'number',
    default: 1
  }
*/
);
router.get('/category/:id', categories_controller_1.default.getCategoryById
/*
  #swagger.tags = ['Category'],
*/
);
router.put('/category/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], categories_controller_1.default.updateCategory
/*
  #swagger.tags = ['Category'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateCategoryRequest'}
    },
  }
*/
);
router.delete('/category/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], categories_controller_1.default.deleteCategory
/*
  #swagger.tags = ['Category'],
  #swagger.security = [{ "bearerAuth": {} }]
*/
);
//* routes event
router.post('/events', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], events_controller_1.default.createEvent
/*
  #swagger.tags = ['Events'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateEventRequest'}
    },
  }
*/
);
router.get('/events', events_controller_1.default.getAllEvents
/*
  #swagger.tags = ['Events']
  #swagger.parameters['category'] = { in: 'query', type: 'string' }
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  #swagger.parameters['isOnline'] = { in: 'query', type: 'boolean' }
  #swagger.parameters['isPublish'] = { in: 'query', type: 'boolean' }
  */
);
router.get('/events/organizers', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ORGANIZER])], events_controller_1.default.getEventByOrganizer
/*
  #swagger.tags = ['Events'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
*/
);
router.get('/events/:id', events_controller_1.default.getEventById
/*
  #swagger.tags = ['Events'],
 */
);
router.get('/events/createdBy/:organizerId', events_controller_1.default.getEventByOrganzer
/*
  #swagger.tags = ['Events'],
 */
);
router.get('/events/:slug/slug', events_controller_1.default.getEventBySlug
/*
  #swagger.tags = ['Events'],
*/
);
router.put('/events/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], events_controller_1.default.updateEvent
/*
  #swagger.tags = ['Events'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateEventRequest'}
    },
  }
*/
);
router.delete('/events/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], events_controller_1.default.deleteEvent
/*
  #swagger.tags = ['Events'],
  #swagger.security = [{ "bearerAuth": {} }]
*/
);
//* router FaQ
router.post('/faqs', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN])], faq_controller_1.default.createFAQ
/*
  #swagger.tags = ['Frequently Asked Questions'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateFAQRequest'}
    },
  }
 */
);
router.get('/faqs', faq_controller_1.default.getFAQ
/*
  #swagger.tags = ['Frequently Asked Questions'],
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  #swagger.parameters['isPublish'] = { in: 'query', type: 'boolean' }
*/
);
router.get('/faqs/:id', faq_controller_1.default.getFAQById
/*
  #swagger.tags = ['Frequently Asked Questions'],
*/
);
router.put('/faqs/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN])], faq_controller_1.default.updateFAQ
/*
  #swagger.tags = ['Frequently Asked Questions'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateFAQRequest'}
    },
  }
 */
);
router.delete('/faqs/:id', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN])], faq_controller_1.default.deleteFAQ
/*
  #swagger.tags = ['Frequently Asked Questions'],
  #swagger.security = [{ "bearerAuth": {} }]
*/
);
//* event volunteer
router.post('/event-volunteers/:eventId', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.MEMBER])], eventVolunteer_controller_1.default.createEventVolunteer
/**
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.parameters['eventId'] = { in: 'path', type: 'string' }
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/CreateEventVolunteerRequest'}
    },
  }
 */
);
router.get('/event-volunteers', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN])], eventVolunteer_controller_1.default.getAllEventVolunteers
/*
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  #swagger.parameters['eventId'] = { in: 'query', type: 'string'}
  #swagger.parameters['userId'] = { in: 'query', type: 'string'}
*/
);
router.get('/event-volunteers/member', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.MEMBER])], eventVolunteer_controller_1.default.getEventVolunteerByMember
/*
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
  #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
*/
);
router.get('/event-volunteers/:eventId', eventVolunteer_controller_1.default.getEventVolunteerByEvent
/*
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.parameters['eventId'] = { in: 'path', type: 'string' }
*/
);
router.put('/event-volunteers/:eventVolunteerId/status', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], eventVolunteer_controller_1.default.updateStatusEventVolunteer
/*
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/UpdateEventVolunteerRequest'}
    },
  }
 */
);
router.delete('/event-volunteers/:eventVolunteerId', [auth_middleware_1.default, (0, acl_middleware_1.default)([constant_1.ROLES.ADMIN, constant_1.ROLES.ORGANIZER])], eventVolunteer_controller_1.default.deleteEventVolunteer
/*
  #swagger.tags = ['Event Volunteers'],
  #swagger.security = [{ "bearerAuth": {} }]
*/
);
//* router upload image
router.post('/image/upload-single', [auth_middleware_1.default, media_middleware_1.default.singleUpload('file')], image_controller_1.default.uploadSingle
/*
  #swagger.tags = ['Image File'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    },
  }
 */
);
router.delete('/image/delete-file', auth_middleware_1.default, image_controller_1.default.deleteFile
/*
  #swagger.tags = ['Image File'],
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: '#/components/schemas/DeleteFileRequest'
    }
  }
 */
);
//* router region
router.get('/regions', region_controller_1.default.getAllProvinces
/*
  #swagger.tags = ['Regions'],
 */
);
router.get('/regions/:id/province', region_controller_1.default.getProvince
/*
  #swagger.tags = ['Regions'],
 */
);
router.get('/regions/:id/regency', region_controller_1.default.getRegency
/*
  #swagger.tags = ['Regions'],
 */
);
router.get('/regions/:id/district', region_controller_1.default.getDistrict
/*
  #swagger.tags = ['Regions'],
 */
);
router.get('/regions/:id/village', region_controller_1.default.getVillage
/*
  #swagger.tags = ['Regions'],
 */
);
router.get('/regions-search', region_controller_1.default.findByCity
/*
  #swagger.tags = ['Regions'],
  #swagger.description = 'Search regions by city name',
 */
);
exports.default = router;
