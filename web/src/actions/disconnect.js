import Swal from 'sweetalert2/dist/sweetalert2';

export default async function disconnect() {
    Swal.queue([{
        title: 'Se déconnecter',
        text: 'Êtes-vous sur de vouloir vous déconnecter ?',
        confirmButtonText: 'Me déconnecter',
        showCancelButton: true,
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: () => fetch('/disconnect')
            .then(async res => {
                const data = await res.json();
                if (data.code !== 200) {
                    throw new Error(data.error).message;
                }
                return true;
            })
            .catch(error => {
                Swal.showValidationMessage(
                    `Erreur lors de la requête : ${error}`
                );
            })
    }])
        .then(res => res.value && Swal.fire({
            title: 'Vous êtes déconnecté !',
            text: 'Vous pouvez fermer cette page',
            icon: 'success',
            preConfirm: () => true
        }))
        .then(res => res && res.value && window.location.reload());

}
