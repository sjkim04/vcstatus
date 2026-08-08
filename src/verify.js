function hex2bin(hex) {
    const buf = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < buf.length; i++) {
        buf[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buf;
}

let PUBLIC_KEY;
const getPublicKey = async key => await crypto.subtle.importKey(
    'raw',
    hex2bin(key),
    {
        name: 'NODE-ED25519',
        namedCurve: 'NODE-ED25519',
        public: true,
    },
    true,
    ['verify'],
);

const encoder = new TextEncoder();

export async function verify(request, env) {
    PUBLIC_KEY ??= await getPublicKey(env.DISCORD_PUBLIC_KEY);

    const signatureHeader = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');

    if(!signatureHeader || !timestamp) return false;

    const signature = hex2bin(signatureHeader);
    const unknown = await request.clone().text();

    return await crypto.subtle.verify(
        'NODE-ED25519',
        PUBLIC_KEY,
        signature,
        encoder.encode(timestamp + unknown)
    );
}