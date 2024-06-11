import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { GitHub } from "arctic";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.user);

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      githubId: attributes.github_id,
    };
  },
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
});

interface DatabaseUserAttributes {
  github_id: number;
  username: string;
}

declare module "lucia" {
  interface Register {
    DatabaseUserAttributes: DatabaseUserAttributes;
    Lucia: typeof lucia;
  }
}
