import amqp from "amqplib";
let channel;
export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_host,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
        });
        channel = await connection.createChannel();
        console.log("✅ Connected to Rabbitmq");
    }
    catch (error) {
        console.error("❌ Failed to connect to Rabbitmq", error);
    }
};
export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        console.error("Rabbitmq channel is not intialized");
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
};
export const invalidateChacheJob = async (cacheKeys) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKeys,
        };
        await publishToQueue("cache-invalidation", message);
        console.log("✅ Cache invalidation job published to Rabbitmq");
    }
    catch (error) {
        console.error("❌ Failed to Publish cache on Rabbitmq", error);
    }
};
