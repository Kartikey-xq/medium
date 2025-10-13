import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type SignupParams = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginParams = z.infer<typeof loginSchema>;

export const blogPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  description : z.string(),
  imageUrl: z.string().url(),
});//create seperate type dont infer from blogpostschema 

export type BlogPostParams = z.infer<typeof blogPostSchema>;

export const updateBlogSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    published: z.boolean(),
  })
  .partial();

export type UpdateBlogParams = z.infer<typeof updateBlogSchema>;

//create type for api response objects:-
//1 blog:- 
export type blog = {
  id: string;
  title:string;
  content:string;
  published:boolean;
  authorId:string;
  authorName: string;
  description: string;
  imageUrl: string;
};
//2 user:-
export type user = {
  id:string;
  name:string;
  email:string;
}

//generic api response 
export type SignupApiResponse = {
  success: boolean;
  message:string;
  user: user;
}
///deploy this fix types unserstand types you blank



