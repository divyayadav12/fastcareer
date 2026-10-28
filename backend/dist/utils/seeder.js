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
exports.seedAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminEmail = 'admin@fastcareers.in';
        const adminUser = yield User_1.default.findOne({ email: adminEmail });
        // Ensure actual admin exists
        if (adminUser) {
            adminUser.password = 'Admin@123';
            yield adminUser.save();
        }
        else {
            yield User_1.default.create({
                firstName: 'System',
                lastName: 'Admin',
                email: adminEmail,
                password: 'Admin@123',
                role: 'admin',
                profileCompleted: true
            });
        }
        // DEMOTE all fake admins
        const allowedAdmins = ['admin@fastcareers.in', 'divyayadav141203@gmail.com', 'divyanshyadav10270@gmail.com'];
        yield User_1.default.updateMany({ role: 'admin', email: { $nin: allowedAdmins } }, { $set: { role: 'employer' } });
        console.log('Admin seed & cleanup ran successfully.');
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
});
exports.seedAdmin = seedAdmin;
