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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var model, dimensions, levels, _i, dimensions_1, dim, createdDim, _a, levels_1, lvl, questions, _b, questions_1, q;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('Seeding database with AIMM data...');
                    return [4 /*yield*/, prisma.maturityModel.create({
                            data: {
                                name: 'Adaptive Integrated Maturity Model (AIMM)',
                                description: 'E-Maturity Assessment Model across People, Innovation, and Capability.',
                                version: '1.0',
                            }
                        })];
                case 1:
                    model = _c.sent();
                    dimensions = [
                        { name: 'People' },
                        { name: 'Innovation' },
                        { name: 'Capability' }
                    ];
                    levels = [
                        { level: 1, name: 'Random', description: 'Ad-hoc, inconsistent, and unpredictable.' },
                        { level: 2, name: 'Emerging', description: 'Some processes defined but unstable.' },
                        { level: 3, name: 'Specified', description: 'Processes defined, documented, and embedded.' },
                        { level: 4, name: 'Measured', description: 'Quantitatively managed, more predictable.' },
                        { level: 5, name: 'Aligned', description: 'Continuous improvement, aligned with strategy.' }
                    ];
                    _i = 0, dimensions_1 = dimensions;
                    _c.label = 2;
                case 2:
                    if (!(_i < dimensions_1.length)) return [3 /*break*/, 12];
                    dim = dimensions_1[_i];
                    return [4 /*yield*/, prisma.dimension.create({
                            data: {
                                name: dim.name,
                                maturityModelId: model.id,
                                description: "".concat(dim.name, " dimension of the AIMM.")
                            }
                        })
                        // Create level descriptions
                    ];
                case 3:
                    createdDim = _c.sent();
                    _a = 0, levels_1 = levels;
                    _c.label = 4;
                case 4:
                    if (!(_a < levels_1.length)) return [3 /*break*/, 7];
                    lvl = levels_1[_a];
                    return [4 /*yield*/, prisma.levelDescription.create({
                            data: {
                                dimensionId: createdDim.id,
                                level: lvl.level,
                                name: lvl.name,
                                description: lvl.description
                            }
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    questions = [];
                    if (dim.name === 'Innovation') {
                        questions = [
                            "How important is innovation to the success of your company?",
                            "Does innovation play a significant role in the strategic intent of your company?",
                            "Is your company's strategy linked to its innovation process?",
                            "Does your company ensure that innovative employee practices and technologies are identified and evaluated?",
                            "Continuous employee innovation practices are institutionalised to ensure they are performed as defined in the company's innovation process."
                        ];
                    }
                    else if (dim.name === 'People') {
                        questions = [
                            "The company has a well-defined skills improvement policy that consistently meets the employee's expectations for training and skills development.",
                            "Employees receive training to improve their knowledge and skill in accordance with the defined skills and development policy.",
                            "Employees are trained and encouraged to improve their knowledge and skills to fulfill more senior roles in the company.",
                            "The integration and empowerment of employee skills and abilities is managed quantitatively and is measured without bias.",
                            "There are individuals who are equipped to provide training to employees, consistently developing them for more significant roles in the company."
                        ];
                    }
                    else if (dim.name === 'Capability') {
                        questions = [
                            "Employees are encouraged to continuously improve their skill and ability toward their personal work processes.",
                            "To what extent does your company maintain a positive attitude towards the application of processes that support the company structure?",
                            "The employee's ability to apply skill-based processes is continuously being improved.",
                            "Do the defined operational processes of company enable high levels of service delivery and high quality products to the customer base?",
                            "Organisational process areas are managed quantitatively to provide avenues of improvement."
                        ];
                    }
                    _b = 0, questions_1 = questions;
                    _c.label = 8;
                case 8:
                    if (!(_b < questions_1.length)) return [3 /*break*/, 11];
                    q = questions_1[_b];
                    return [4 /*yield*/, prisma.question.create({
                            data: {
                                text: q,
                                dimensionId: createdDim.id
                            }
                        })];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _b++;
                    return [3 /*break*/, 8];
                case 11:
                    _i++;
                    return [3 /*break*/, 2];
                case 12: 
                // Create an admin user
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            name: 'Admin User',
                            email: 'admin@aimm.local',
                            role: 'ADMIN',
                        }
                    })
                    // Create an organization
                ];
                case 13:
                    // Create an admin user
                    _c.sent();
                    // Create an organization
                    return [4 /*yield*/, prisma.organization.create({
                            data: {
                                name: 'Demo Organization',
                                industry: 'Technology',
                                size: 50,
                            }
                        })];
                case 14:
                    // Create an organization
                    _c.sent();
                    console.log('Seeding completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
