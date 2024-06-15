export const permissionHandler = (role) => {
    switch (role) {
        case 1:
            return ['dashboard', 'jump', 'observe', 'contract', 'action'];
        case 2:
            return ['dashboard', 'jump', 'observe', 'contract', 'action'];
        case 3:
            return ['dashboard', 'jump', 'observe', 'contract'];
        default:
            return ['dashboard', 'jump', 'observe', 'contract'];
    }
};
