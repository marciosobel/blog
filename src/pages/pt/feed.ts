import type { APIRoute } from "astro";
import { createFeed } from "@/feed";

export const GET: APIRoute = () => createFeed("pt");
