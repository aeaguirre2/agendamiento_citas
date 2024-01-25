const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
let db = require('../database/db.js');

// Function to write the current state of the database to db.json and db.js
function writeDb() {
  const data = {
    appointments: db.appointments
  };

  // Write to db.json
  fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Data written to db.json');
  });

  // Write to db.js
  fs.writeFile(path.join(__dirname, '../database/db.js'), 'module.exports = ' + JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Data written to db.js');
  });
}

// GET endpoint to retrieve all appointments
app.get('/appointments', cors(), (req, res) => {
  res.json(db.appointments);
});

// GET endpoint to retrieve a specific appointment by ID
app.get('/appointments/:id',cors(),  (req, res) => {
  const { id } = req.params;

  const appointment = db.appointments.find(appointment => appointment.id === id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  res.json(appointment);
});

// POST endpoint to create a new appointment
app.post('/appointments',(req, res) => {
  console.log('Request Body:', req.body)
  const { date, name, description } = req.body;

  if (!date || !name || !description) {
    return res.status(400).json({ error: 'date, name and description are required' });
  }

  // Get the last appointment's ID and increment it by 1
  const lastAppointmentId = db.appointments[db.appointments.length - 1].id;
  const newId = parseInt(lastAppointmentId, 10) + 1;

  const newAppointment = { id: newId.toString(), date, name, description };
  db.appointments.push(newAppointment);
  writeDb();
  res.status(201).json(newAppointment);
});

app.put('/appointments/:id', (req, res) => {
  const id = req.params.id;
  const { date, name, description } = req.body;

  const appointmentIndex = db.appointments.findIndex(appointment => appointment.id === id);
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.appointments[appointmentIndex] = { id, date, name, description };

  writeDb();
  res.json(db.appointments[appointmentIndex]);
});

// DELETE endpoint to delete an existing appointment
app.delete('/appointments/:id', (req, res) => {
  const { id } = req.params;

  const appointmentIndex = db.appointments.findIndex(appointment => appointment.id === id);
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.appointments.splice(appointmentIndex, 1);
  writeDb();
  res.status(204).end();
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
