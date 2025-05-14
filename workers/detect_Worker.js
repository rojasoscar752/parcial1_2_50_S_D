const connect = require('../queues/rabbitmq');

(async () => {
    try {
        const channel = await connect();
        await channel.assertQueue('detect_queue', { durable: true });
        await channel.prefetch(1);
        await channel.assertExchange('processed_images', 'fanout', { durable: true });

        console.log('Detect worker esperando mensaje');

        channel.consume('detect_queue', async (msg) => {
            if (!msg) return;

            const info = JSON.parse(msg.content.toString());
            console.log(`procesando ID en detect: ${info.id}`);

            setTimeout(() => {
                console.log(`Procesamiento finalizado: ${info.id}`);

                const finalMessage = {
                    id: info.id,
                    status: 'completado'
                }
                channel.publish('processed_images', '', Buffer.from(JSON.stringify(finalMessage)));
                channel.ack(msg);
            }, 1500);

        });

    } catch (err) {
        console.error('Error en detectWorker:', err.message);
    }
})();
