# Immersive Story Platform: System Design Architecture

> [!NOTE]
> Below is the precise architecture diagram for the platform. It maps out the flow from the client devices through the Edge Network to the Cloudflare Workers, Prisma Accelerate, and the PostgreSQL database.
>
> *(You can copy this exact Mermaid syntax and paste it into **draw.io** by going to `Arrange > Insert > Advanced > Mermaid...` to get a native draw.io file, or just view it perfectly rendered below!)*

```mermaid
flowchart TD
    %% Define Styles
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef edge fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef db fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef storage fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff

    %% Client Layer
    subgraph Client_Layer [Client Layer / Browser]
        UI[React + Vite Frontend]
        Reader[Immersive Reader UI\nLightbox Media]
        Writer[StoryEditor.tsx\nTipTap Engine]
        CharTracker[Character Tracker\nModal/Sidebar]
        Dashboard[Creator Dashboard\nRecharts]
        
        UI --> Reader
        UI --> Writer
        Writer <--> CharTracker
        UI --> Dashboard
    end
    
    class UI,Reader,Writer,CharTracker,Dashboard client

    %% Network / CDN Layer
    Client_Layer -- HTTPS / JWT --> CloudflareCDN{Cloudflare CDN\nEdge Cache}

    %% Backend Layer (Serverless)
    subgraph Backend_Layer [Backend Layer - Cloudflare Workers]
        Hono[Hono Web Framework]
        AuthMW[Auth Middleware]
        
        RouterBlog[Blog Router\nPagination & Parsing]
        RouterAnalytics[Analytics Router\nAggregations]
        RouterUpload[Upload Router\nPresigned URLs]
        RouterInteract[Interactions Router\nLikes/Saves]
        
        Hono --> AuthMW
        AuthMW --> RouterBlog
        AuthMW --> RouterAnalytics
        AuthMW --> RouterUpload
        AuthMW --> RouterInteract
    end

    class Hono,AuthMW,RouterBlog,RouterAnalytics,RouterUpload,RouterInteract edge

    CloudflareCDN <--> Backend_Layer

    %% Connection Pooling Layer
    Backend_Layer -- Edge Compatible Query --> PrismaAccel[Prisma Accelerate\nConnection Pooling]

    %% Data Layer
    subgraph Data_Layer [Database & Storage]
        Postgres[(PostgreSQL\nMain Database)]
        
        S3Bucket[AWS S3 Bucket\nMedia Storage]
    end
    
    class Postgres db
    class S3Bucket storage
    class PrismaAccel db

    PrismaAccel <--> Postgres
    RouterUpload -- Generates URL --> S3Bucket
    Client_Layer -. Direct Upload .-> S3Bucket

    %% Database Entities
    subgraph DB_Schema [Core Prisma Entities]
        UserEntity[User]
        PostEntity[Post\nJSON Content]
        GenreEntity[Genre]
        CharEntity[Character]
        ActionEntity[Likes/Saves/Comments]
        
        UserEntity -->|Creates| PostEntity
        PostEntity <-->|Many-to-Many| GenreEntity
        PostEntity -->|Owns| CharEntity
        UserEntity -->|Interacts| ActionEntity
        ActionEntity -->|Targets| PostEntity
    end
    
    Postgres -. Contains .-> DB_Schema
```

## How the Data Flows

1. **Writing a Story (Writer flow):**
   - The writer opens `StoryEditor.tsx` (TipTap).
   - They type `@John`. The UI triggers the `Character Tracker` state, sending a temporary JSON object.
   - When they hit Save, the frontend hits the `Blog Router` with the TipTap JSON document, Title, and Genre IDs.
   - Images are uploaded directly from the browser to the `AWS S3 Bucket` using a presigned URL fetched from the `Upload Router`.
   
2. **Reading a Story (Reader flow):**
   - The reader visits a story URL. The request hits `Cloudflare CDN`. If cached, it returns instantly (<50ms).
   - If not cached, the `Blog Router` fetches the JSON from `PostgreSQL` via `Prisma Accelerate`.
   - The React frontend receives the JSON, parses it, and renders the `Immersive Reader UI`.
   - The reader clicks "Like". The `Interactions Router` validates the JWT and updates the database, simultaneously updating the post's metrics for the `Analytics Router`.
