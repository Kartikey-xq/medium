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
  content: z.string(), // This will now hold TipTap JSON string
  description : z.string(),
  imageUrl: z.string().url().optional(),
  genreIds: z.array(z.string()).optional(),
});

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
//1 Genre & Character sub-types
export type Genre = {
  id: string;
  name: string;
};

export type Character = {
  id: string;
  name: string;
  status: string | null;
  bio: string | null;
  postId: string;
};

//2 blog:- 
export type blog = {
  id: string;
  title: string;
  content: string; // TipTap JSON format
  published: boolean;
  authorId: string;
  authorName: string;
  description: string;
  imageUrl: string | null;
  viewCount: number;
  genres?: Genre[];
  characters?: Character[];
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
  message: string;
  user: user;
};

export type SingleBlogApiResponse = {
  success: boolean;
  message: string;
  blog: blog;
};

export type BulkBlogApiResponse = {
  success: boolean;
  message: string;
  blog: blog[];
  totalPages: number;
  currentPage: number;
};

export type AnalyticsApiResponse = {
  success: boolean;
  stats: {
    totalViews: number;
    totalReads: number;
    totalLikes: number;
    totalSaves: number;
    totalComments: number;
  };
  recentPosts: (Omit<blog, 'content' | 'description'> & { 
    _count: { reads: number; likes: number; saves: number; comments: number } 
  })[];
};


    //zod schema for like validation:
    const likeSchema = z.object({
        blogId: z.string().min(1),
        userId: z.string().min(1)
    });
    type LikeParams = z.infer<typeof likeSchema>;
    //type for like api response:
    type LikeApiResponse = {
        success: boolean;
        message: string;
        likesCount: number;
    }
