const express = require('express');
const multer = require('multer');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const upload = multer({ dest: '/data/uploads/' });
const statusDB = '/data/status.json';

let channel = null;

async function connectRabbit() {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue('resize_queue', { durable: true });
    await channel.assertQueue('watermark_queue', { durable: true });
    await channel.assertQueue('detect_queue', { durable: true });
}

connectRabbit();

function updateStatus(id, step, value) {
    let db = {};
    if (fs.existsSync(statusDB)) {
        db = JSON.parse(fs.readFileSync(statusDB));
    }
    db[id] = db[id] || { id, resize: false, watermark: false, detect: false };
    db[id][step] = value;
    fs.writeFileSync(statusDB, JSON.stringify(db));
}

app.post('/upload', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    const id = uuidv4();

    updateStatus(id, 'resize', false);

    const message = { id, path: imagePath };

    channel.sendToQueue('resize_queue', Buffer.from(JSON.stringify(message)), { persistent: true });
    res.json({ message: 'Image received', id });
});

app.get('/status/:id', (req, res) => {
    if (!fs.existsSync(statusDB)) return res.status(404).json({ error: 'Not found' });
    const db = JSON.parse(fs.readFileSync(statusDB));
    const data = db[req.params.id];
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
});

app.listen(3000, () => console.log('API running on port 3000'));
