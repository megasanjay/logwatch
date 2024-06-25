import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const user = protectRoute(event);

  const { appid, channelid } = event.context.params as {
    appid: string;
    channelid: string;
  };

  const query = getQuery(event);

  const lastLogId = (query.lastLogId as string) || "0";

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
      id: {
        gt: parseInt(lastLogId),
      },
    },
    orderBy: {
      created: "desc",
    },
  });

  return {
    logs: logs.map((log) => ({
      id: log.id,
      created: log.created,
      level: log.level,
      message: log.message,
    })),
  };
});
