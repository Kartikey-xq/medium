export type Env ={
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}
export type Blog = {
    id: string;
    title: string;
    content: string;
    description?: string;
    imageUrl?: string;
    published: boolean;
    authorId: string;
    authorName: string;
};