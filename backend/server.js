import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const port = 5000

const app = express()

app.use(cors())
app.use(bodyParser.json())


app.get('/', async (req, res) => {
  res.send("<div>Hallo</>")
})

app.post('/webhook', (req, res) => {
  console.log(req.body) 
  res.send('Ok')
})

app.listen(port, () => {  
  console.log(`App listening on port : ${port}`)
})