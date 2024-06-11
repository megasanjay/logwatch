import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { github } from "~/server/utils/auth";

interface GitHubUser {
  id: string;
  login: string;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;

  const storedState = getCookie(event, "github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await prisma.user.findFirst({
      where: {
        github_id: parseInt(githubUser.id),
      },
    });

    if (existingUser) {
      const id = existingUser.id;

      const session = await lucia.createSession(id, {});

      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );

      return sendRedirect(event, "/");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await prisma.user.create({
      data: {
        id: userId,
        github_id: parseInt(githubUser.id),
        username: githubUser.login,
      },
    });

    const session = await lucia.createSession(userId, {});

    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    return sendRedirect(event, "/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      throw createError({
        status: 400,
      });
    }

    throw createError({
      message: (e as any) ?? "An error occurred",
      status: 500,
    });
  }
});
