const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const BASE_URL = 'https://api.jsonbin.io/v3/b';

if (!API_KEY || !BIN_ID) {
    console.error('Missing JSONBin environment variables');
}

export const jsonbin = {
    get: async () => {
        const response = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
            headers: {
                'X-Access-Key': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`JSONBin fetch error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.record; // JSONBin wraps data in a "record" object
    },

    update: async (data: any) => {
        const response = await fetch(`${BASE_URL}/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': API_KEY,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`JSONBin update error: ${response.statusText}`);
        }

        return await response.json();
    },
};
