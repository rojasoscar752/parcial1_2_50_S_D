const connect = require('../queues/rabbitmq');

(async () => {
    const channel = await connect();
    await channel.assertQueue('watermark_queue', { durable: true });
    await channel.prefetch(1);
    console.log('Marca de agua lista y esperando mensajes');

    channel.consume('watermark_queue', async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        console.log(`Recibido en marca de agua ID: ${data.id}`);

        setTimeout(() => {
            console.log(`Marca de agua terminado para: ${data.id}`);
            const next = JSON.stringify({
                id: data.id,
                path: data.path
            });

            channel.sendToQueue('detect_queue', Buffer.from(next), { persistent: true });
            channel.ack(msg);
        }, 1800); 
    });
})();
