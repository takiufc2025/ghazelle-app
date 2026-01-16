const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ضع رابط الـ Web App الخاص بك هنا بعد النشر
const GOOGLE_SHEET_URL = 'رابط_جوجل_شيت_الخاص_بك';

app.post('/api/orders', async (req, res) => {
    try {
        // ترتيب البيانات لتطابق أعمدة الشيت التي ذكرتها
        const orderData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            contact_phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            to_commune_name: req.body.city,
            to_wilaya_name: req.body.wilaya,
            product_list: `الموديل: ${req.body.model} | المقاس: ${req.body.size}`,
            is_stopdesk: req.body.delivery_type === 'المكتب',
            stopdesk_id: req.body.stopdesk_id || ""
        };

        await axios.post(GOOGLE_SHEET_URL, orderData);
        res.status(200).send("Success");
    } catch (error) {
        console.error("خطأ في الإرسال:", error.message);
        res.status(500).send("Error");
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
