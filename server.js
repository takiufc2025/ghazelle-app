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

// رابط Google Apps Script الخاص بك (تأكد من تحديثه بعد كل Deploy)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw7keXVKb4LsL0thEo6hFaQEXplapzALUBq-w7p6QcCXF8aIvgEn9Em2i3M7eyYvveGUw/exec';

app.post('/api/orders', async (req, res) => {
    try {
        // تجهيز البيانات بنفس الصيغة التي يتوقعها كود Google Apps Script الخاص بك
        const formData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            wilaya: req.body.wilaya,
            commune: req.body.city, // ربط 'city' من النموذج بـ 'commune' في جوجل
            description: `موديل: ${req.body.model}, مقاس: ${req.body.size}`,
            stopdesk_id: req.body.stopdesk_id || ""
        };

        // إرسال البيانات إلى جوجل
        const googleResponse = await axios.post(GOOGLE_SHEET_URL, formData);
        
        console.log("✅ تم إرسال الطلبية لجوجل بنجاح");
        res.status(200).send("Success");

    } catch (error) {
        console.error("❌ خطأ في الإرسال:", error.message);
        res.status(500).send("حدث خطأ أثناء معالجة الطلب");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ: ${PORT}`);
});
