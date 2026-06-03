const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
    const text1 = "김멀대TV" || req.body.inText;
    console.log(text1);

    const sendText = {
        text: "전송 성공!!"
    };
    res.send(sendText);
});

app.listen(port, () => {
    console.log("Example Server is Listening at https://localhost:" + port);
})