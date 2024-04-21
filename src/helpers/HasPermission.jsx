import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuthStore } from '@/stores/authStore';

const HasPermission = (props) => {
    const { permission, children } = props;
    const [hasPermission, setHasPermission] = useState(false);
    const { permissionArray } = useAuthStore();

    const checkHasPermission = useCallback(async () => {
        // get the user role permission
        if (permissionArray) {
            const isPermission = permissionArray.includes(permission);
            setHasPermission(!!isPermission);
        }
    }, [permission, permissionArray]);

    useEffect(() => {
        checkHasPermission();
    }, [checkHasPermission]);

    return hasPermission ? <>{children}</> : '';
};

export default HasPermission;

HasPermission.propTypes = {
    children: PropTypes.element,
    permission: PropTypes.string,
};
