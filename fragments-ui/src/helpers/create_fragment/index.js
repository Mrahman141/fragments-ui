
export const create_fragment = async (type, data, user) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    console.log('Adding the fragment to the database...');

    try {
        const res = await fetch(`${apiUrl}/v1/fragments`, {
            method: "POST", 
            headers: {
                ...user.authorizationHeaders(), 
                "Content-Type": type, 
            },
            body: JSON.stringify(data), 
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return await res.json();

    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
};