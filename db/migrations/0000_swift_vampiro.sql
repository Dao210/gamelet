CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp with time zone,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"image_url" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"water_count" integer DEFAULT 0 NOT NULL,
	"position_x" real NOT NULL,
	"position_y" real NOT NULL,
	"radius" real DEFAULT 50 NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waterings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"plant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"xp_gained" integer DEFAULT 10 NOT NULL,
	CONSTRAINT "unique_user_plant_per_day" UNIQUE("plant_id","user_id","")
);
--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waterings" ADD CONSTRAINT "waterings_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waterings" ADD CONSTRAINT "waterings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "plants_author_id_idx" ON "plants" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "plants_level_idx" ON "plants" USING btree ("level");--> statement-breakpoint
CREATE INDEX "plants_created_at_idx" ON "plants" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "plants_position_idx" ON "plants" USING btree ("position_x","position_y");