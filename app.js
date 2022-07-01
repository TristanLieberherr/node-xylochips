const express = require('express')
const multer = require('multer')
const path = require('path')
const fsExtra = require('fs-extra')


const port = 443
const url = "894317.web01.swisscenter.com"
const storageDir = 'tmp/files'
const app = express()
app.set('view engine', 'ejs')
const storage = multer.diskStorage({
  destination: storageDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })


app.get('/', (req, res) => {
  res.render(`${__dirname}/public/index`, {
    files: fsExtra.readdirSync(storageDir).sort().reverse(),
    url: `${url}:${port}`
  })
})

app.post('/delete', (req, res) => {
  fsExtra.emptyDirSync(storageDir)
  console.log("Erased all files")
  res.sendStatus(200)
})

app.post('/upload', upload.single('file'), (req, res) => {
  console.log("Uploaded new file:", req.file.originalname)
  res.sendStatus(200)
})

app.get('/download/:id', (req, res) => {
  res.download(path.join(`${__dirname}/${storageDir}/${req.params.id}`))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})