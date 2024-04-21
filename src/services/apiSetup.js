import axios from 'axios';

export const urlDeterminator = () => {
    return process.env.VITE_API_URL;
};

export const apiUrl = urlDeterminator();

export const fetcher = async (url, method = 'GET', data = {}) => {
    try {
        const auth = localStorage.getItem('auth-stock-dashboard');
        const token = JSON.parse(auth)?.state?.token;
        const result = await axios({
            method,
            url: `${apiUrl}${url}`,
            headers: {
                'x-access-token': token ? `${token}` : null,
            },
            data,
        });
        return {
            ...result?.data,
        };
    } catch (err) {
        throw new Error(err?.response?.data?.message);
    }
};

export const swrFetcher = async (url, data, method = 'GET') => {
    try {
        const auth = localStorage.getItem('auth-stock-dashboard');
        const token = JSON.parse(auth)?.state?.token;
        const res = await axios({
            url: `${apiUrl}${url}`,
            method,
            headers: {
                'x-access-token': token ? `${token}` : null,
            },
            data,
        });

        return res.data;
    } catch (err) {
        if (err?.response?.data?.message === 'Unauthorized') {
            localStorage.clear();
            location.reload();
        }
        throw new Error(err?.response?.data?.message);
    }
};
