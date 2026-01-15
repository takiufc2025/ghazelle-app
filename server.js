const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // ضروري لإرسال البيانات لجوجل

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// --- ضع هنا رابط Google Apps Script الذي حصلت عليه ---
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzXhyydkxWVIFckS5wmajQaF7zNT4vaSbCfzN30hV6UPqYyBWVAHkJ45OnzyBVBhT60/exec';
app.post('/api/orders', async (req, res) => {
    try {
        // 1. إرسال البيانات إلى Google Sheets
        // نقوم بإرسال req.body الذي يحتوي على (الاسم، اللقب، الهاتف، المودال، إلخ)
        await axios.post(GOOGLE_SHEET_URL, req.body);
        console.log("✅ أرسلت الطلبية إلى Google Sheets بنجاح");

        // 2. حفظ نسخة احتياطية محلياً في ملف orders.json
        const filePath = path.join(__dirname, 'orders.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            let orders = [];
            if (!err && data) {
                try { orders = JSON.parse(data); } catch (e) { orders = []; }
            }
            
            orders.push({ 
                id: Date.now(), 
                time: new Date().toLocaleString('ar-DZ'),
                ...req.body 
            });

            fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
                if (err) console.error("❌ خطأ في الحفظ المحلي");
                else console.log("💾 حُفظت نسخة احتياطية في orders.json");
            });
        });

        // إرسال رد نجاح للمتصفح
        res.status(200).send("Success");

    } catch (error) {
        console.error("❌ فشل الإرسال لجوجل شيت:", error.message);
        // حتى لو فشل جوجل، نحاول الرد بالنجاح إذا كان العميل قد أرسل بياناته
        res.status(500).json({ message: "حدث خطأ في الربط مع جوجل شيت" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ: ${PORT}`);
});
