import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Metronome } from "../target/types/metronome";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { BN } from "bn.js";

describe("metronome", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Metronome as Program<Metronome>;

  // 🌟 La cuenta clonada de Pyth (SOL/USD)
  const PYTH_ORACLE = new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");

  it("¡El Oso despierta y lee el Oráculo!", async () => {
    const wallet = provider.wallet as anchor.Wallet;

    // 1. Imprimir dólares falsos solo para este test
    const mint = await createMint(provider.connection, wallet.payer, wallet.publicKey, null, 6);
    const userTokenAccount = await createAssociatedTokenAccount(provider.connection, wallet.payer, mint, wallet.publicKey);
    await mintTo(provider.connection, wallet.payer, mint, userTokenAccount, wallet.payer, 1000000);

    // 2. Crear la Bóveda con un ID basado en la hora actual
    const rhythmId = new BN(Date.now());
    const [rhythmPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("rhythm"), wallet.publicKey.toBuffer(), rhythmId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    const vaultAccount = await getOrCreateAssociatedTokenAccount(provider.connection, wallet.payer, mint, rhythmPDA, true);
    const vaultTokenAccount = vaultAccount.address;

    // 3. Ejecutar el contrato: Guardar las reglas
    // 3. Ejecutar el contrato: Guardar las reglas
    await program.methods.initializeRhythm(rhythmId, new BN(100), 1, 15)
      .accounts({
        user: wallet.publicKey,
        userTokenAccount: userTokenAccount,
        vaultTokenAccount: vaultTokenAccount,
      })
      .rpc();

    // 4. 🐻👀 ¡EL OSO MIRA EL ORÁCULO!
    const tx = await program.methods.checkAndExecute()
      .accounts({
        rhythmAccount: rhythmPDA,
        pythOracle: PYTH_ORACLE,
      })
      .rpc();

    // 5. El Hacker Logger: Extraemos el mensaje secreto de la Matrix
    await provider.connection.confirmTransaction(tx, "confirmed");
    const txDetails = await provider.connection.getTransaction(tx, { commitment: "confirmed" });

    console.log("\n=======================================================");
    console.log("🕵️‍♀️ LOGS SECRETOS DE LA MATRIX:");
    txDetails?.meta?.logMessages?.forEach(log => {
      if (log.includes("Oso") || log.includes("Precio")) {
        console.log("👉", log);
      }
    });
    console.log("=======================================================\n");
  });
});