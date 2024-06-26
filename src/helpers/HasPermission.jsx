import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

const HasPermission = (props) => {
    const { permission, children } = props;
    const [hasPermission, setHasPermission] = useState(false);
    const { permissionArray } = useAuthStore();

    const checkHasPermission = useCallback(async () => {
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
