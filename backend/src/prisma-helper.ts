import { PrismaClient } from '@prisma/client/edge';
import {withAccelerate} from '@prisma/extension-accelerate';

export function getPrisma(databaseUrl: string) {
    var url = databaseUrl ?? process.env.DATABASE_URL;
    if(!url){
        throw new Error("DATABASE_URL is not defined");
    }
    databaseUrl = url;
    return new PrismaClient({ datasourceUrl: databaseUrl }).$extends(withAccelerate())
}