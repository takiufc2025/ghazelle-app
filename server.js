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

// ضع رابط الويب أب الجديد هنا بعد عمل Deploy
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHc6BXYrF4ePKnxTxQZE4trmonIchjIl01EoLX1pSMcimslFvK2pzhwsK8KcJh-Yi-/exec';

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            firstname: req.body.firstname,
            familyname: req.body.familyname,
            contact_phone: req.body.phone, // الربط الصحيح لرقم الهاتف
            delivery_type: req.body.delivery_type,
            to_commune_name: req.body.commune,
            to_wilaya_name: req.body.wilaya,
            product_list: req.body.description,
            is_stopdesk: req.body.delivery_type === 'stop desk',
            stopdesk_id: req.body.stopdesk_id || ""
        };

        const response = await axios.post(GOOGLE_SCRIPT_URL, orderData);
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Error");
    }
});

app.get('/api/yalidine-data', async (req, res) => {
    try {
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?action=getYalidineData`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json([]);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`));

