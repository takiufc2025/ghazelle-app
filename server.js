const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
// استخدام المنفذ الذي يحدده الخادم السحابي أو 3000 محلياً
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
// جعل المجلد الحالي هو مصدر الملفات الثابتة مثل index.html
app.use(express.static(__dirname));

// استقبال الطلبات وحفظها
app.post('/api/orders', (req, res) => {
    const filePath = path.join(__dirname, 'orders.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        let orders = [];
        if (!err && data) {
            try { orders = JSON.parse(data); } catch (e) { orders = []; }
        }
        
        // إضافة الطلبية الجديدة مع التوقيت
        orders.push({ 
            id: Date.now(), 
            time: new Date().toLocaleString('ar-DZ'),
            ...req.body 
        });

        fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) return res.status(500).send("خطأ في السيرفر");
            console.log("✅ تم استلام طلبية جديدة من: " + (req.body.firstname || "عميل"));
            res.status(200).send("Success");
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 المحرك يعمل بنجاح على المنفذ: ${PORT}`);
});
