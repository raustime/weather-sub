const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

// Статичні файли з Vue dist
app.use(express.static(path.join(__dirname, '../client/dist')))

// Роутинг для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
