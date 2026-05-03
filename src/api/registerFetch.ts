
export const registerFetch = async (data:unknown) => {
    const url = import.meta.env.VITE_API_AUTH_REGISTER;

    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // se convierten los datos a JSON
    };

    const response = await fetch(url, params);
    const result = await response.json();

    if (response.status !== 200) throw result;
    
    return result;

}
