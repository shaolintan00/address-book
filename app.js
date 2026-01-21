const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shaolintan0_db_user:EJ1aItRktUf4chJJ@cluster0.bchvrls.mongodb.net/addressbook';

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        avatar: { type: String, default: '', trim: true }
    },
    { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
        res.json(contacts);
    } catch (error) {
        console.error('Fetch contacts failed:', error);
        res.status(500).json({ message: 'Failed to fetch contacts.', error: error.message });
    }
});

app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).lean();
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: 'Invalid contact id.' });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create contact.', error: error.message });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).lean();
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update contact.', error: error.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id).lean();
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found.' });
        }
        res.json({ message: 'Contact deleted.' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete contact.' });
    }
});

app.use(express.static(path.join(__dirname, 'dist', 'address-book')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'address-book', 'index.html'));
});

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

