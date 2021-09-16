require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.json())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    console.log(note)
    response.json(note)
  })
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const updateNote= request.body
  notes=notes.map(note => note.id !== id ? note : updateNote)
  response.json(updateNote)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content===undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note =new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    })
  
    note.save().then(savedNote=>{
      response.json(savedNote)
    })
  
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})