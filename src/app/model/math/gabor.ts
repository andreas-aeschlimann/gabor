declare var Module: any;

export class Gabor {

    static fgc2(f: number[], xi: number, sigma: number, lambda: number, theta: number, amount: number): number[] {

        /*

        // Check size
        if (f.length <= 0) {
            console.error("Input data length is 0.");
            return f;
        }
        const n: number = Math.sqrt(f.length);
        if (n % 1 !== 0 || Math.log2(n) % 1 !== 0) {
            console.error("Input data length is not power of 2.");
            return f;
        }

        // Generate float arrays
        const f2: Float32Array = new Float32Array(f);
        let fConv: Float32Array = new Float32Array(f.length);

        // Call c code
        try {
            const buffer1 = Module._malloc(f2.length * f2.BYTES_PER_ELEMENT);
            const buffer2 = Module._malloc(fConv.length * fConv.BYTES_PER_ELEMENT);
            Module.HEAPF32.set(f2, buffer1 >> 2);
            Module.HEAPF32.set(fConv, buffer2 >> 2);

            Module.ccall(
                "fgc2",
                null,
                ["number", "number", "number", "number", "number", "number", "number", "number"],
                [buffer1, buffer2, n, xi, sigma, lambda, theta, amount]
            );

            fConv = new Float32Array(Module.HEAPF32.buffer, buffer2, fConv.length);
            Module._free(buffer1);
            Module._free(buffer2);

        } catch (e) {
            console.error(e);
        }

        return Array.from(fConv);*/

    }

}
