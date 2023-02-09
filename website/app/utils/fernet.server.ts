import fernet from "fernet";

const fernetSecret = new fernet.Secret("5F2fsyIiMId3qaEt0UEyQ5q0HEurBZrj7LSTF9BFJVk=");

export function decodeToken(token: string) {
    // The module requires us to create a new token,
    // which then can get decrypted.
    return new fernet.Token({
        secret: fernetSecret,
        token,
        ttl: 0,
    }).decode();
}

export function tokenize(data: string | Object): string {
    // The module requires us to create a new token,
    // which we then use to encode ONE payload.
    // This cannot be reused so we have to create a new token on every request.
    const token = new fernet.Token({
        secret: fernetSecret,
    });

    return token.encode(JSON.stringify(data));
}
