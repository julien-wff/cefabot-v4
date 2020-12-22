import { getContext } from 'svelte';
import Swal from 'sweetalert2/dist/sweetalert2';

const Mixin = Swal.mixin({
    title: 'Changer le mot de passe',
    showCancelButton: true,
    progressSteps: [1, 2, 3],
});

export async function changePassword(API_ROOT) {

    const { value: current } = await Mixin.fire({
        currentProgressStep: 0,
        text: 'Mot de passe actuel',
        input: 'password',
    });
    if (!current)
        return;

    const { value: newPwd } = await Mixin.fire({
        currentProgressStep: 1,
        text: 'Nouveau mot de passe',
        input: 'password',
    });
    if (!newPwd)
        return;

    await Mixin.fire({
        currentProgressStep: 2,
        text: 'Confirmation du nouveau mot de passe',
        input: 'password',
        inputValidator: input => input !== newPwd && 'Les deux mots de passe doivent être identiques',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: () => fetch(`${API_ROOT}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({
                current,
                new: newPwd
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
            return true;
        })
        .catch(error => {
            Swal.fire({
                title: `Erreur lors de la requête : ${error.message || error}`,
                icon: 'error'
            });
        })
        .then(res => res && Swal.fire({
            title: 'Mot de passe modifié !',
            icon: 'success',
        }));
}
