import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export type SignupParams = z.infer<typeof signupSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginParams = z.infer<typeof loginSchema>;
export declare const blogPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    description: z.ZodString;
    imageUrl: z.ZodString;
}, z.core.$strip>;
export type BlogPostParams = z.infer<typeof blogPostSchema>;
export declare const updateBlogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateBlogParams = z.infer<typeof updateBlogSchema>;
export type blog = {
    id: string;
    title: string;
    content: string;
    published: boolean;
    authorId: string;
    authorName: string;
    description: string;
    imageUrl: string;
};
export type user = {
    id: string;
    name: string;
    email: string;
};
export type SignupApiResponse = {
    success: boolean;
    message: string;
    user: user;
};
