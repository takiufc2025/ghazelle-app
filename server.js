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

// !!! استبدل هذا الرابط بالرابط الذي حصلت عليه بعد النشر (Deploy) من جوجل !!!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVohOusjinmnh6zp4HxKWERaZ8OZZN52NPDT1LN8rlTYqzTgcAqnPDFSmkefCC4_E1Sw/exec';

// مسار جلب الولايات والبلديات من Sheet2
app.get('/api/yalidine-data', async (req, res) => {
    try {
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getYalidineData`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Yalidine data:", error.message);
        res.status(500).json([]);
    }
});

// مسار استقبال الطلب من الموقع وإرساله إلى Sheet1
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            phone: req.body.phone,
            delivery_type: req.body.delivery_type,
            to_commune_name: req.body.commune, // الربط مع حقل البلدية في الموقع
            to_wilaya_name: req.body.wilaya,   // الربط مع حقل الولاية في الموقع
            product_list: req.body.description, // الوصف الكامل للمنتج
            is_stopdesk: req.body.delivery_type === 'stop desk',
            stopdesk_id: req.body.stopdesk_id || ""
        };

        const response = await axios.post(GOOGLE_SCRIPT_URL, orderData);
        res.status(200).send("تم تسجيل الطلبية بنجاح");
    } catch (error) {
        console.error("Order submission error:", error.message);
        res.status(500).send("فشل في إرسال الطلب");
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
