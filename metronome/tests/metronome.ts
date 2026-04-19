import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Metronome } from "../target/types/metronome";
import { expect } from "chai";

describe("metronome", () => {
    // Configura tu compu para simular la red de Solana
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Metronome as Program<Metronome>;

    it("¡Inicializa un Rhythm correctamente!", async () => {
        // 1. Creamos una "bóveda" vacía para guardar los datos
        const rhythmAccount = anchor.web3.Keypair.generate();

        // 2. Definimos los datos que mandaría el usuario desde tu web
        const depositAmount = new anchor.BN(100); // 100 USDC
        const buyDrop = 5; // Comprar si cae 5%
        const sellPump = 10; // Vender si sube 10%

        // 3. Ejecutamos tu Contrato Inteligente en Rust
        await program.methods
            .initializeRhythm(depositAmount, buyDrop, sellPump)
            .accounts({
                rhythmAccount: rhythmAccount.publicKey,
                user: provider.wallet.publicKey,
            })
            .signers([rhythmAccount])
            .rpc();

        // 4. Vamos a leer la blockchain de mentira para ver si se guardó la info
        const account = await program.account.rhythm.fetch(rhythmAccount.publicKey);

        // 5. Imprimimos los resultados en la consola
        console.log("Wallet del dueño:", account.owner.toBase58());
        console.log("Plata depositada:", account.depositAmount.toString(), "USDC");
        console.log("Drop:", account.buyDropPercentage, "% | Pump:", account.sellPumpPercentage, "%");

        // 6. La validación profesional
        expect(account.depositAmount.toNumber()).to.equal(100);
    });
});