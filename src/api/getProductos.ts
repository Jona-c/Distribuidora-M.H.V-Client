
export const getProductos = async (url) => {
    const resp = await fetch(url);
    const data = await resp.json();

    if (resp.status !== 200) throw data;
    return data;
}

