import modal

# 1. Definimos nuestra aplicación en Modal
app = modal.App("metronome-oracle-backend")

# 2. Preparamos la imagen de la computadora virtual (le instalamos la librería de Runway que usaremos mañana)
image = modal.Image.debian_slim().pip_install("runwayml")

# 3. Creamos el Endpoint (El Mozo) que va a escuchar a tu frontend en Next.js
@app.function(image=image)
@modal.web_endpoint(method="POST")
def generate_oracle_video(item: dict):
    prompt = item.get("prompt", "")
    
    # 🛡️ GUARDRAILS: Chequeo de seguridad en el servidor
    prompt_lower = prompt.lower()
    is_valid = any(word in prompt_lower for word in ["sol", "usdc", "rhythm", "market", "volatility", "crypto"])

    if not is_valid:
        # Mañana conectamos esto al video de Kirk negando con la cabeza
        return {
            "text": "My apologies. As the Oracle of The Metronome, my expertise is strictly limited to Solana, USDC, and DCA strategies.",
            "video": "https://www.w3schools.com/html/mov_bbb.mp4" 
        }

    # 🎬 --- ZONA HACKATHON (AQUÍ ENTRA RUNWAY MAÑANA) ---
    # client = RunwayML(api_key="NUESTRA_KEY_SECRETA")
    # response = client.videos.generate(
    #     promptText=prompt,
    #     model="gen3a-turbo",
    #     ...
    # )
    # ----------------------------------------------------

    # Por ahora (Jueves), devolvemos nuestra respuesta de prueba
    return {
        "text": "Analyzing Solana market conditions... Volatility is optimal. I recommend setting a 2% Buy Drop rhythm.",
        "video": "https://www.w3schools.com/html/mov_bbb.mp4" 
    }