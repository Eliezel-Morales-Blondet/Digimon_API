const btn = document.getElementById('button');
function limpiarFormulario() {
    document.getElementById("form").reset();
}

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    btn.value = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_n8jdy9d';

    emailjs.sendForm(serviceID, templateID, this).then(
        () => {
            btn.value = 'Enviar';
            alert('Mensaje enviado correctamente.');
            limpiarFormulario();
        },
        (err) => {
            btn.value = 'Enviar';
            alert(JSON.stringify(err));
        },
    );
});
