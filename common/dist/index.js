"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.blogPostSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    confirmPassword: zod_1.z.string(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.blogPostSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    description: zod_1.z.string(),
    imageUrl: zod_1.z.string().url(),
}); //create seperate type dont infer from blogpostschema 
exports.updateBlogSchema = zod_1.z
    .object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean(),
})
    .partial();
///deploy this fix types unserstand types you blank
