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

// استبدل الرابط أدناه برابط Google Apps Script الخاص بك
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzXhyydkxWVIFckS5wmajQaF7zNT4vaSbCfzN30hV6UPqYyBWVAHkJ45OnzyBVBhT60/exec';

app.post('/api/orders', async (req, res) => {
    try {
        // إرسال البيانات إلى Google Sheets
        await axios.post(GOOGLE_SHEET_URL, req.body);
        
        // حفظ نسخة احتياطية محلياً
        const filePath = path.join(__dirname, 'orders.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            let orders = [];
            if (!err && data) {
                try { orders = JSON.parse(data); } catch (e) { orders = []; }
            }
            orders.push({ id: Date.now(), time: new Date().toLocaleString('ar-DZ'), ...req.body });
            fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
                if (!err) console.log("💾 حُفظت نسخة احتياطية");
            });
        });

        res.status(200).send("Success");
    } catch (error) {
        console.error("❌ فشل الإرسال:", error.message);
        res.status(500).send("Error");
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ: ${PORT}`);
});

