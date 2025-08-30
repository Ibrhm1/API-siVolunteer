"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = exports.TYPE = exports.ROLES = void 0;
var ROLES;
(function (ROLES) {
    ROLES["ADMIN"] = "admin";
    ROLES["MEMBER"] = "member";
    ROLES["ORGANIZER"] = "organizer";
})(ROLES || (exports.ROLES = ROLES = {}));
var TYPE;
(function (TYPE) {
    TYPE["MEMBER"] = "member";
    TYPE["ORGANIZER"] = "organizer";
})(TYPE || (exports.TYPE = TYPE = {}));
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "pending";
    STATUS["ACCEPTED"] = "accepted";
    STATUS["REJECTED"] = "rejected";
})(STATUS || (exports.STATUS = STATUS = {}));
