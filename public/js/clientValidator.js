window.addEventListener("load", function () {
  const formulario = document.getElementById("clientform");

  formulario.addEventListener("submit", function (e) {
    let ulErrors = document.querySelector("div.fe-errors ul");

    //Reset the ul to empty to avoid duplicating error render
    ulErrors.innerHTML = "";

    let errors = [];

    const firstName = document.querySelector("#firstName");
    const reName = new RegExp(/[^a-zA-Z]/);

    if (
      firstName.value == "" ||
      firstName.value.length < 3 ||
      firstName.value.match(reName) != null //sera nulo solo cuando haya letras
    ) {
      errors.push(
        "Tu 1er Nombre debe tener al menos 2 letras y no poseer espacios"
      );
    }
    const lastName = document.querySelector("#lastName");

    if (
      lastName.value == "" ||
      lastName.value.length < 3 ||
      lastName.value.match(reName) != null
    ) {
      errors.push(
        "Tu 1er Apellido debe tener al menos 2 letras y no poseer espacios"
      );
    }
    const email = document.querySelector("#email");

    const reEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if (email.value == "" || email.value.match(reEmail) == null) {
      errors.push("Debes ingresar un Email valido");
    }

    const reNumber = new RegExp(/[^0-9]/);
    if (
      mobile.value == "" ||
      mobile.value.length < 8 ||
      mobile.value.length > 20 ||
      mobile.value.match(reNumber) != null
    ) {
      errors.push("Debes ingresar un telefono valido");
    }

    const city_Id = document.querySelector("#city_Id");

    if (city_Id.value == "") {
      errors.push("Debes seleccionar una Ciudad");
    }

    const address = document.querySelector("#address");
    const reAddress = new RegExp(/[^A-Za-z0-9\s]/);
    console.log(address.value);

    if (address.value == "" || address.value.match(reAddress) != null) {
      errors.push("la direccion debe ser valida, ej: Calle falsa 123");
    }

    const dni = document.querySelector("#dni");
    const reDni = new RegExp(/[^0-9]/);

    if (
      dni.value == "" ||
      dni.value.length < 8 ||
      dni.value.match(reDni) != null
    ) {
      errors.push("DNI sin espacios, puntos ni guiones");
    }

    var avatarFile = document.getElementById("avatarFile");

    var files = avatarFile.files;
    if (files.length == 0) {
      errors.push("Debe cargar una imagen");
    } else {
      var filename = files[0].name;

      var extension = filename.substr(filename.lastIndexOf("."));

      var allowedExtensionsRegx = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

      var isAllowed = allowedExtensionsRegx.test(extension);

      if (!isAllowed) {
        errors.push("La imagen debe ser: .jpg, .jpeg, .png, .gif");
      }
      var fileSize = files[0].size;

      var size = Math.round(fileSize / 1024);

      if (size > 1024) {
        errors.push("La imagen debe pesar menos de 1mb");
      }
    }

    const role = document.querySelector("#role");

    if (role.value == "") {
      errors.push("Debes seleccionar tu perfil (cliente o profesional)");
    }

    const password = document.querySelector("#password");
    const password2 = document.querySelector("#password2");
    const rePassword = new RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
    );

    if (password.value.match(rePassword) == null) {
      errors.push(
        "la contraseña debe tener al menos 8 caracteres, una mayus, un numero,  y algun: ! @ # $ % ^ & * "
      );
    }
    if (password2.value != password.value) {
      errors.push("las contraseñas deben Coincidir ");
    }

    if (errors.length > 0) {
      e.preventDefault();

      for (i = 0; i < errors.length; i++) {
        ulErrors.innerHTML += "<li>" + errors[i] + "</li>";
      }
    }
  });
});
