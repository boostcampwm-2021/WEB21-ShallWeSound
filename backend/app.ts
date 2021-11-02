import express from 'express';

const app: express.Application = express();

app.get('/', (req, res) => {
  res.send('정상 작동합니다.');
});

app.listen(3000, () => {
  console.log('작동중');
});
