const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ضع رابط الـ Web App الذي نسخته بعد الضغط على Déployer في جوجل
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw7keXVKb4LsL0thEo6hFaQEXplapzALUBq-w7p6QcCXF8aIvgEn9Em2i3M7eyYvveGUw/exec';

app.post('/api/orders', async (req, res) => {
    try {
        const formData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            wilaya: req.body.wilaya,
            commune: req.body.city,
            description: `Model: ${req.body.model}, Size: ${req.body.size}`,
            stopdesk_id: req.body.stopdesk_id || ""
        };

        await axios.post(GOOGLE_SHEET_URL, formData);
        res.status(200).send("Success");
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error");
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});
