// Función para obtener y mostrar los contactos
function obtenerYMostrarContactos() {
  fetch('/contactos')
  .then(response => response.json())
  .then(contactos => {
      const contenedor = document.getElementById('lista-contactos');
      contenedor.innerHTML = ''; // Limpiar el contenedor existente

      contactos.forEach(contacto => {
          // Crear el elemento HTML para cada contacto
          const contactoDiv = document.createElement('div');
          contactoDiv.className = 'contacto';
          contactoDiv.innerHTML = `
              <p>Nombre: ${contacto.nombre}</p>
              <p>Email: ${contacto.email}</p>
              <p>Teléfono: ${contacto.telefono}</p>
              <button onclick="editarContacto(${contacto.id})">Editar</button>
              <button onclick="eliminarContacto(${contacto.id})">Eliminar</button>
          `;
          
          // Agregar el contacto al contenedor
          contenedor.appendChild(contactoDiv);
      });
  })
  .catch(error => console.error('Error:', error));
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', obtenerYMostrarContactos);


//Creación de un contacto
document.getElementById('crear-contacto-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const contacto = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value
    };

    fetch('/contactos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacto),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Contacto creado:', data);
        alert('Contacto creado exitosamente'); // Mensaje de confirmación para el usuario
        obtenerYMostrarContactos(); // Actualizar la lista de contactos
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al crear el contacto'); // Mensaje de error para el usuario
    });
});



function editarContacto(id) {
  console.log("Editando contacto con ID:", id);
  fetch(`/contactos/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Contacto no encontrado');
        }
        return response.json();
    })
  .then(contacto => {
      document.getElementById('editar-id').value = contacto.id;
      document.getElementById('editar-nombre').value = contacto.nombre;
      document.getElementById('editar-email').value = contacto.email;
      document.getElementById('editar-telefono').value = contacto.telefono;

      // Mostrar el formulario de edición
      document.getElementById('editar-contacto-form').style.display = 'block';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al obtener el contacto: ' + error.message);
});
}

// Editar contacto
document.getElementById('editar-contacto-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const contactoActualizado = {
      id: document.getElementById('editar-id').value,
      nombre: document.getElementById('editar-nombre').value,
      email: document.getElementById('editar-email').value,
      telefono: document.getElementById('editar-telefono').value
  };

  fetch(`/contactos/${contactoActualizado.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactoActualizado),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al actualizar el contacto');
      }
      return response.json();
  })
  .then(data => {
      console.log('Contacto actualizado:', data);
      alert('Contacto actualizado exitosamente');
      obtenerYMostrarContactos(); // Actualizar la lista de contactos
      document.getElementById('editar-contacto-form').style.display = 'none';
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error al actualizar el contacto');
  });
});

//Eliminar contacto
function eliminarContacto(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      fetch(`/contactos/${id}`, { method: 'DELETE' })
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al eliminar el contacto');
          }
          return response.json();
      })
      .then(data => {
          console.log('Contacto eliminado:', data);
          alert('Contacto eliminado exitosamente');
          obtenerYMostrarContactos(); // Actualizar la lista de contactos
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error al eliminar el contacto: ' + error.message);
      });
  }
}

