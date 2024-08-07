import { verifyRequestOrigin } from "lucia";
import type { User, Session } from "lucia";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;

    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      // Check if in the /log api endpoint
      if (event.node.req.url?.startsWith("/api/log")) {
        return;
      }

      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  }

  if (!session) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );
  }

  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    session: Session | null;
    user: User | null;
  }
}
