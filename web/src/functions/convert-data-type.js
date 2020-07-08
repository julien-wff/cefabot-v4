export const dataTypes = {
    string: 'String',
    boolean: 'Boolean',
    int: 'Nombre entier',
    float: 'Nombre décimal',
    array: 'Liste',
    object: 'Objet',
    'discord-role': 'Rôle Discord',
    'discord-user': 'Utilisateur Discord',
    'discord-channel': 'Salon Discord',
};

export function humanizeDataType(type, capital = true) {
    let data = dataTypes[type];
    if (!capital)
        data = data.charAt(0).toLowerCase() + data.slice(1);
    return data;
}
