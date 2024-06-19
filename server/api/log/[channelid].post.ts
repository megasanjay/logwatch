import { z } from "zod";

export default defineEventHandler(async (event) => {
  const user = protectRoute(event);

  const { channelid } = event.context.params as { channelid: string };

  const bodySchema = z
    .object({
      level: z.union([
        z.literal("info"),
        z.literal("warn"),
        z.literal("error"),
        z.literal("debug"),
        z.literal("fatal"),
        z.literal("trace"),
      ]),
      message: z.string().optional(),
    })
    .strict();

  const body = await readBody(event);

  // Check if the body is present
  if (!body) {
    throw createError({
      message: "Missing required fields",
      statusCode: 400,
    });
  }

  // Check if the body is valid
  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    console.log(parsedBody.error);

    throw createError({
      message: "The provided parameters are invalid",
      statusCode: 400,
    });
  }

  const log = await prisma.log.create({
    data: {
      level: parsedBody.data.level || "info",
      message: parsedBody.data.message || "",
      channel_id: channelid,
    },
  });

  if (!log) {
    throw createError({
      message: "An error occurred while creating the log",
      statusCode: 500,
    });
  }

  // Return a 201 status code
  return {
    statusCode: 201,
  };
});
