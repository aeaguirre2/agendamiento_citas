import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VerCitasAgendadas() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/appointments')
      .then(response => response.json())
      .then(data => setCitas(data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const handleUpdateClick = (id, newData) => {
    fetch(`http://localhost:3001/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
    .then(response => response.json())
    .then(updatedAppointment => {
      const updatedCitas = citas.map(cita => {
        if (cita.id === updatedAppointment.id) {
          return updatedAppointment;
        } else {
          return cita;
        }
      });
      setCitas(updatedCitas);
      alert('Cita actualizada con éxito');
    })
    .catch(error => {
      console.error('Error al actualizar la cita:', error);
      alert('Hubo un error al actualizar la cita. Por favor, inténtalo de nuevo.');
    });
  };

  const handleFieldChange = (id, field, value) => {
    const updatedCitas = citas.map(cita => {
      if (cita.id === id) {
        return { ...cita, [field]: value };
      } else {
        return cita;
      }
    });
    setCitas(updatedCitas);
  };

  return (
    <div>
      <Link to="/crear-cita">Crear nueva cita</Link>
      <h2>Citas Agendadas:</h2>
      <div>
        {citas.length === 0 ? (
          <p>No hay citas agendadas.</p>
        ) : (
          citas.map(cita => (
            <div key={cita.id}>
              <p>
                <input
                  type="text"
                  value={cita.date}
                  onChange={(e) => handleFieldChange(cita.id, 'date', e.target.value)}
                />
              </p>
              <button onClick={() => handleUpdateClick(cita.id, cita)}>
                Actualizar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VerCitasAgendadas;
