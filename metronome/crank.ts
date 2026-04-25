import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Metronome } from "./target/types/metronome";
import { PublicKey } from "@solana/web3.js";

// 1. Conectamos el script a tu Matrix Local
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Metronome as Program<Metronome>;

const PYTH_ORACLE = new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");

async function runCrank() {
    console.log("☕🤖 Iniciando el Cerebro Automático del Oso (Crank)...");

    // 2. El bucle infinito (se ejecuta cada 10 segundos)
    setInterval(async () => {
        try {
            console.log("\n⏳ [Crank] Buscando bóvedas activas...");

            // 3. El Crank busca TODAS las bóvedas que existan en tu protocolo
            const rhythms = await program.account.rhythm.all();

            if (rhythms.length === 0) {
                console.log("💤 No hay clientes ni bóvedas activas. El Oso sigue durmiendo.");
                return;
            }

            console.log(`🐻 ¡Se encontraron ${rhythms.length} bóvedas! Despertando al Oso...`);

            // 4. Por cada bóveda, le pedimos al Oso que mire el precio
            for (const rhythm of rhythms) {
                console.log(`🔍 Revisando bóveda ID: ${rhythm.account.id.toString()}`);

                // El Oso ejecuta su visión
                const tx = await program.methods.checkAndExecute()
                    .accounts({
                        rhythmAccount: rhythm.publicKey,
                        pythOracle: PYTH_ORACLE,
                    })
                    .rpc();

                console.log(`✅ ¡Precio revisado exitosamente en la Matrix!`);
            }
            console.log("--------------------------------------------------");

        } catch (error) {
            console.error("❌ Error en el Crank:", error.message);
        }
    }, 10000); // 10000 milisegundos = 10 segundos
}

runCrank();