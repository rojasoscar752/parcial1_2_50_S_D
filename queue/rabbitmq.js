const amqp = require('amqplib');

async function connect() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq');
        const channel = await connection.createChannel();
        console.log('Conectado a RabbitMQ');
        return channel;
    } catch (err) {
        console.error('No se pudo conectar a RabbitMQ:', err.message);
        process.exit(1);
    }
}

module.exports = connect;
