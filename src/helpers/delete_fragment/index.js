export const deleteFragment = async (id, user) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    let res = null;
    try {
        res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            method: 'DELETE',
            headers: {
                ...user.authorizationHeaders(),
            },
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Unable to call DELETE /v1/fragments', { err });
    }
};
