import Swal from 'sweetalert2/dist/sweetalert2';

export const addAccount = (API_ROOT) => new Promise(async resolve => {

    const { value: id } = await Swal.fire({
        title: 'Ajouter un compte',
        text: 'ID Discord',
        input: 'text',
        showCancelButton: true,
        inputValidator: v => !v.match(/^\d{18}$/) && 'ID Discord invalide',
    });
    if (!id)
        return;

    return Swal.fire({
        title: 'Ajouter un compte',
        text: 'Nom du compte',
        input: 'text',
        showCancelButton: true,
        inputValidator: v => !v.match(/^[a-zA-Z0-9#_\- \/]{2,30}$/) && 'Nom invalide',
        preConfirm: name => fetch(`${API_ROOT}/trusted-accounts`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                name,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    })
        .then(async res => {
            if (!res || !res.value)
                return;

            const resData = await res.value.json();
            if (res.value.status !== 200) {
                throw new Error(resData.error);
            }
            resolve();
            return true;
        })
        .catch(error => {
            Swal.fire({
                title: `Erreur lors de la requête : ${error.message || error}`,
                icon: 'error'
            });
        })
        .then(res => res && Swal.fire({
            title: 'Compte ajouté !',
            icon: 'success',
        }));

});