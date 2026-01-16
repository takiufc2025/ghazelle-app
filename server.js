const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات الوسائط
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// !!! ضع رابط الـ Web App الخاص بك من جوجل هنا !!!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyS0zxaAdIjQylIhPA1oAcI59I2GaE5dIOXP5mvKUptXMjMvE2pHnVDIdn9f63BQFyyLQ/exec';

// مسار جلب بيانات الولايات والبلديات (Yalidine Data)
app.get('/api/yalidine-data', async (req, res) => {
    try {
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getYalidineData`);
        res.json(response.data);
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error.message);
        res.status(500).json([]);
    }
});

// مسار إرسال الطلبيات الجديد
app.post('/api/orders', async (req, res) => {
    try {
        // ترتيب البيانات لتطابق أعمدة الشيت (من A إلى N)
        const orderData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            contact_phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            to_commune_name: req.body.commune, // تم تعديلها لتطابق حقل البلدية
            to_wilaya_name: req.body.wilaya,
            product_list: req.body.description, // الوصف الكامل للموديل واللون والمقاس
            is_stopdesk: req.body.delivery_type === 'stop desk',
            stopdesk_id: req.body.stopdesk_id || ""
        };

        const response = await axios.post(GOOGLE_SCRIPT_URL, orderData);
        res.status(200).send("تم تسجيل الطلبية بنجاح");
    } catch (error) {
        console.error("خطأ في الإرسال إلى جوجل:", error.message);
        res.status(500).send("فشل في إرسال الطلب");
    }
});

// تقديم ملف index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل الآن على المنفذ ${PORT}`);
});

