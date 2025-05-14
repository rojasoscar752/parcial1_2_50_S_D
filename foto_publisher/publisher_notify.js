const connect = require('../queues/rabbitmq');

(async () => {
    const channel = await connect();
    await channel.assertExchange('processed_images', 'fanout', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, 'processed_images', '');
    channel.consume(q.queue, msg => {
        const data = JSON.parse(msg.content.toString());
        console.log('notificación: imagen procesada:', data.id);
    }, { noAck: true });
})();
