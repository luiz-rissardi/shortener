export class HashId {
    constructor(secretKey = 123456789) {
        this.alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.base = BigInt(this.alphabet.length);
        this.secret = Number(secretKey);
        // Limite de 40 bits (~1.1 trilhão), garantindo estritamente no máximo 7 caracteres em Base 62
        this.maxLimit = (1n << 40n) - 1n; 
    }

    // Função de Feistel adaptada para blocos de 20 bits
    #f(right, round) {
        let temp = right * 1103515245 + this.secret + round * 12345;
        return (temp ^ (temp >> 13)) & 0xFFFFF; // Máscara de 20 bits
    }

    #encrypt(id) {
        let n = BigInt(id);
        if (n > this.maxLimit) {
            throw new Error("O ID excede o limite suportado para hashes de até 7 caracteres.");
        }
        let left = Number(n >> 20n);
        let right = Number(n & 0xFFFFFn);

        // 4 Rodadas de embaralhamento (Feistel)
        for (let i = 0; i < 4; i++) {
            let nextLeft = right;
            let nextRight = left ^ this.#f(right, i);
            left = nextLeft;
            right = nextRight;
        }

        return (BigInt(left) << 20n) | BigInt(right);
    }

    #decrypt(obfId) {
        let n = BigInt(obfId);
        let left = Number(n >> 20n);
        let right = Number(n & 0xFFFFFn);

        // 4 Rodadas reversas para recuperar o ID sequencial original
        for (let i = 3; i >= 0; i--) {
            let nextRight = left;
            let nextLeft = right ^ this.#f(left, i);
            left = nextLeft;
            right = nextRight;
        }

        return (BigInt(left) << 20n) | BigInt(right);
    }

    // Recebe o ID sequencial, mascara e converte para Base 62 (máx. 7 caracteres)
    encode(sequenceId) {
        let obfuscated = this.#encrypt(sequenceId);
        if (obfuscated === 0n) return this.alphabet[0];

        let encoded = "";
        let num = obfuscated;
        while (num > 0n) {
            let remainder = Number(num % this.base);
            encoded = this.alphabet[remainder] + encoded;
            num = num / this.base;
        }
        return encoded;
    }

    // Reverte o hash mascarado de volta para o ID sequencial numérico
    decode(hash) {
        let obfuscated = 0n;
        for (let i = 0; i < hash.length; i++) {
            let char = hash[i];
            let index = this.alphabet.indexOf(char);
            if (index === -1) {
                throw new Error(`Caractere inválido: ${char}`);
            }
            obfuscated = obfuscated * this.base + BigInt(index);
        }

        let originalId = this.#decrypt(obfuscated);
        return Number(originalId);
    }
}