export const getMeFetch = async (token:any) => {
    const url = import.meta.env.VITE_API_USER_ME;

    const params = {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;

    return result;

}
