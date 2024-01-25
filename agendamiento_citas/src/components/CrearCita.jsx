import React, { useState } from 'react';

function CrearCita() {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleConfirmClick = () => {
    if (selectedDate) {
      const nuevaCita = {
        date: selectedDate,
        name: 'Nombre de la cita',
        description: 'Descripción de la cita'
      };

      fetch('http://localhost:3001/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCita),
      })
      .then(response => response.json())
      .then(data => {
        alert('Cita creada con éxito');
        setSelectedDate('');
      })
      .catch(error => {
        console.error('Error al crear la cita:', error);
        alert('Hubo un error al crear la cita. Por favor, inténtalo de nuevo.');
      });
    }
  };

  return (
    <div>
      <p>Seleccione la fecha para agendar una cita:</p>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <button onClick={handleConfirmClick}>Confirmar cita</button>
    </div>
  );
}

export default CrearCita;
