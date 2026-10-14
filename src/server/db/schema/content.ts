import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const publishStatus = pgEnum("publish_status", [
  "draft",
  "published",
  "archived",
]);
export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// Reusable image reference stored on any entity
export type ImageRef = {
  publicId: string;
  width: number;
  height: number;
  alt: string;
  blur?: string;
};

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(), // "home" | "about" | "services" | "contact" | "privacy" | "terms"
    title: text("title").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogImage: jsonb("og_image").$type<ImageRef>(),
    sections: jsonb("sections")
      .$type<
        Array<{ id: string; type: string; enabled: boolean; data: unknown }>
      >()
      .notNull()
      .default([]),
    status: publishStatus("status").notNull().default("published"),
    ...timestamps,
  },
  (t) => [uniqueIndex("pages_key_uq").on(t.key)],
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    tagline: text("tagline"), // e.g. "Independent Reviews & Recommendations"
    summary: text("summary").notNull(),
    body: jsonb("body"), // Tiptap JSON
    icon: text("icon"), // lucide icon name key (allow-listed)
    cardTone: text("card_tone").default("royal"), // royal | charcoal | slate
    image: jsonb("image").$type<ImageRef>(),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: publishStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [uniqueIndex("services_slug_uq").on(t.slug)],
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(), // "Lead Consultant"
    credentials: text("credentials"), // "FCA, FCIB, PhD"
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    bio: jsonb("bio"), // Tiptap JSON
    photo: jsonb("photo").$type<ImageRef>(),
    linkedinUrl: text("linkedin_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: publishStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [uniqueIndex("team_slug_uq").on(t.slug)],
);

export const caseStudies = pgTable(
  "case_studies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    clientName: text("client_name"), // nullable -> "Confidential client"
    industry: text("industry"),
    serviceId: uuid("service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    summary: text("summary").notNull(),
    challenge: jsonb("challenge"),
    approach: jsonb("approach"),
    outcome: jsonb("outcome"),
    metrics: jsonb("metrics")
      .$type<Array<{ label: string; value: string }>>()
      .default([]),
    cover: jsonb("cover").$type<ImageRef>(),
    featured: boolean("featured").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: publishStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("cs_slug_uq").on(t.slug),
    index("cs_status_pub_idx").on(t.status, t.publishedAt),
  ],
);

export const postCategories = pgTable(
  "post_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
  },
  (t) => [uniqueIndex("pcat_slug_uq").on(t.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: jsonb("body").notNull(), // Tiptap JSON
    cover: jsonb("cover").$type<ImageRef>(),
    categoryId: uuid("category_id").references(() => postCategories.id, {
      onDelete: "set null",
    }),
    authorId: uuid("author_id").references(() => teamMembers.id, {
      onDelete: "set null",
    }),
    readingMinutes: integer("reading_minutes"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: publishStatus("status").notNull().default("draft"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("posts_slug_uq").on(t.slug),
    index("posts_status_pub_idx").on(t.status, t.publishedAt),
  ],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(), // "book_call" | "contact"
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    interest: text("interest"), // service key
    message: text("message"),
    preferredTime: text("preferred_time"),
    recaptchaScore: integer("recaptcha_score_x100"),
    ipHash: text("ip_hash"),
    status: leadStatus("status").notNull().default("new"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [index("leads_status_created_idx").on(t.status, t.createdAt)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").primaryKey(), // `${bucket}:${hashedIpOrEmail}`
    count: integer("count").notNull().default(0),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("rate_limits_reset_idx").on(t.resetAt)],
);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1), // singleton
  data: jsonb("data").notNull(), // validated by SiteSettingsSchema (Zod)
  ...timestamps,
});

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    publicId: text("public_id").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    bytes: integer("bytes"),
    format: text("format"),
    alt: text("alt"),
    folder: text("folder"),
    uploadedBy: text("uploaded_by"),
    ...timestamps,
  },
  (t) => [uniqueIndex("media_public_id_uq").on(t.publicId)],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    action: text("action").notNull(), // "post.update"
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    summary: jsonb("summary"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)],
);
