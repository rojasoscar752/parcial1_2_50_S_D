const connect = require('../queues/rabbitmq');

(async () => {
    const channel = await connect();
    await channel.assertQueue('resize_queue', { durable: true });
    await channel.prefetch(1);

    channel.consume('resize_queue', async (msg) => {
        const { id, path } = JSON.parse(msg.content.toString());
        console.log('[Resize] Procesando imagen con ID:', id);

        setTimeout(() => {
            console.log('[Resize] Completado para ID:', id);
            const nextMessage = { id, path };
            channel.sendToQueue('watermark_queue', Buffer.from(JSON.stringify(nextMessage)), {
                persistent: true
            });

            channel.ack(msg);
        }, 1500);
    });
})();
