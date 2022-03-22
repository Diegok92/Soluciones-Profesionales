window.addEventListener('load', function(){
    let dform = document.getElementById('delete-form');

    dform.addEventListener('click', function(e){
        e.preventDefault();
        swal({
            title: "Seguro que quieres eliminar tu perfil?",
            text: "Una vez confirmado, esta acción no puede deshacerse y perderás toda tu información y configuraciones",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Lamentamos que te vayas! Si deseas volver aquí estaremos!", {
                icon: "success",
              }, window.location.href = `/clients/${req.session.dniFound}/deleteClient?_method=DELETE`);
            } else {
                swal("Tu perfil está a salvo!");
            }
          });
    })
})