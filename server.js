const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// استبدل هذا الرابط برابط الـ Web App الذي حصلت عليه من جوجل
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7keXVKb4LsL0thEo6hFaQEXplapzALUBq-w7p6QcCXF8aIvgEn9Em2i3M7eyYvveGUw/exec';

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            contact_phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            to_commune_name: req.body.city,
            to_wilaya_name: req.body.wilaya,
            product_list: `Model: ${req.body.model} | Size: ${req.body.size}`,
            is_stopdesk: req.body.delivery_type === 'المكتب',
            stopdesk_id: req.body.stopdesk_id || ""
        };

        await axios.post(GOOGLE_SCRIPT_URL, orderData);
        res.status(200).send("Success");
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Error");
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Live on ${PORT}`));
