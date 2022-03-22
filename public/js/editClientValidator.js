window.addEventListener("load", function () {
  const formulario = document.querySelector("form");

  formulario.addEventListener("submit", function (e) {
    let ulErrors = document.querySelector("div.fe-errors ul");

    //Reset the ul to empty to avoid duplicating error render
    ulErrors.innerHTML = "";

    let errors = [];

    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const email = document.querySelector("#email");
    const mobile = document.querySelector("#mobile");
    const address = document.querySelector("#address");
    const avatar = document.querySelector("#avatar");

    //Valid RegEx structures for each input
    const regexName = new RegExp(/[^a-zA-Z]/);
    const regexEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const regexNumber = new RegExp(/[^0-9]/);
    const regexAddress = new RegExp(/[^A-Za-z0-9\s]/);

    if (
      firstName.value == "" ||
      firstName.value.length < 2 ||
      firstName.value.match(regexName) != null
    ) {
      errors.push(
        "Tu 1er Nombre debe tener al menos 2 letras y no poseer espacios"
      );
    }
    if (
      lastName.value == "" ||
      lastName.value.length < 2 ||
      lastName.value.match(regexName) != null
    ) {
      errors.push(
        "Tu 1er Apellido debe tener al menos 2 letras y no poseer espacios"
      );
    }
    if (email.value != "") {
      if (email.value.match(regexEmail) == null) {
        errors.push("Debes ingresar un email válido");
      }
    }
    if (mobile.value == "" || mobile.value.match(regexNumber) != null) {
      errors.push("Debes ingresar un número de teléfono válido");
    }
    if (address.value == "" || address.value.match(regexAddress) != null) {
      errors.push("la direccion debe ser valida, ej: Calle falsa 123");
    }

    const avatarFile = document.getElementById("avatarFile");

    const files = avatarFile.files;
    if (files.length == 0) {
      errors.push("Debe cargar una imagen");
    } else {
      const filename = files[0].name;

      const extension = filename.substr(filename.lastIndexOf("."));

      const allowedExtensionsRegx = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

      const isAllowed = allowedExtensionsRegx.test(extension);

      if (!isAllowed) {
        errors.push("La imagen debe ser: .jpg, .jpeg, .png, .gif");
      }
      const fileSize = files[0].size;

      const size = Math.round(fileSize / 1024);

      if (size > 1024) {
        errors.push("La imagen debe pesar menos de 1mb");
      }
    }

    if (errors.length > 0) {
      e.preventDefault();

      for (let i = 0; i < errors.length; i++) {
        ulErrors.innerHTML += `<li>${errors[i]}</li>`;
      }
    }
  });
});
