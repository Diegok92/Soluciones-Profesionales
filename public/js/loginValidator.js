window.addEventListener('load', function(){
    
    const form = document.getElementById('form-login');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    
    form.addEventListener('submit', function(e){
        let errors = [];
        let ulErrors = document.querySelector("div.fe-errors ul");

        //Reset the ul to empty to avoid duplicating error render
        ulErrors.innerHTML = '';
        
        if (email.value == '' || password.value == '') {
            errors.push('Completa tus datos para iniciar sesión')
        }

        if (errors.length > 0) {
            e.preventDefault();
      
            for (let i = 0; i < errors.length; i++) {
              ulErrors.innerHTML += `<li>${errors[i]}</li>`;
            }
        };
    
    });

})  