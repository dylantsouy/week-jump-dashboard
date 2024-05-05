export const permissionHandler = (role) => {
    switch (role) {
        case 1:
            return ['dashboard', 'jump', 'action'];
        case 2:
            return ['dashboard', 'jump', 'action'];
        case 3:
            return ['dashboard'];
        default:
            return ['dashboard'];
    }
};
