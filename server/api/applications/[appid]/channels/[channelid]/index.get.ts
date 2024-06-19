export default defineEventHandler(async (event) => {
  const user = protectRoute(event);

  const { appid, channelid } = event.context.params as {
    appid: string;
    channelid: string;
  };

  const channel = await prisma.channel.findFirst({
    include: {
      application: true,
    },
    where: {
      id: channelid,
    },
  });

  if (!channel) {
    throw createError({
      message: "Channel not found",
      statusCode: 404,
    });
  }

  const logs = await prisma.log.findMany({
    where: {
      channel: {
        id: channelid,
      },
    },
    orderBy: {
      created: "desc",
    },
    take: 10,
  });

  return {
    channel: {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      expiration: channel.expiration,
    },
    application: {
      id: channel.application.id,
      name: channel.application.name,
    },
    logs: logs.map((log) => ({
      id: log.id,
      level: log.level,
      message: log.message,
      created: log.created,
    })),
  };
});
