export const permissionHandler = (role) => {
    switch (role) {
        case 1:
            return ['dashboard', 'jump', 'observe', 'action'];
        case 2:
            return ['dashboard', 'jump', 'observe', 'action'];
        case 3:
            return ['dashboard', 'jump', 'observe'];
        default:
            return ['dashboard', 'jump', 'observe'];
    }
};
