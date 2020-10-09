import Swal from 'sweetalert2/dist/sweetalert2';

export const uploadFile = async (path, botID) => Swal.fire({
    title: 'Ajouter un fichier',
    html: `Le fichier sera stocké dans l'emplacement suivant : <pre><code>/${path}</code></pre>`,
    input: 'file',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: file => {
        if (!file) return false;
        let body = new FormData();
        body.append('file', file);
        body.append('path', path);
        return fetch(`/api/storage/${botID}`, {
            method: 'POST',
            body,
        });
    }
})
    .then(async res => {
        if (!res || !res.value) return;
        if (!res.value.ok) {
            let error = {};
            try {
                error = await res.value.json();
            } catch {}
            throw new Error(error.error || res.statusText);
        }
        Swal.fire({
            text: 'Fichier uploadé !',
            icon: 'success'
        });
    })
    .catch(err => {
        console.error(err);
        Swal.fire({
            title: 'Une erreur est survenue',
            text: err.message || err,
            icon: 'error'
        });
    });


// export const createFolder = (path, botID) => Swal.fire({
//     title: 'Nouveau dossier',
//     text: 'Nom du dossier',
//     input: 'text',
//     inputValidator: value => !!value,
// });
