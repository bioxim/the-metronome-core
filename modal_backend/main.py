import modal
import os

app = modal.App("metronome-oracle-backend")

image = modal.Image.debian_slim().pip_install("runwayml", "fastapi[standard]", "requests")

@app.function(
    image=image, 
    secrets=[modal.Secret.from_name("runway-key")],
    timeout=300 
)
@modal.fastapi_endpoint(method="POST")
def generate_oracle_video(item: dict):
    import time
    import requests
    import os

    prompt = item.get("prompt", "")
    runway_key = os.environ.get("RUNWAY_API_KEY")

    if not runway_key:
        return {"text": "⚠️ ERROR: Llave de Runway no encontrada en la bóveda.", "video": None}

    # ==========================================
    # 1. 🛡️ GUARDRAILS
    # ==========================================
    prompt_lower = prompt.lower()
    keywords = ["sol", "solana", "usdc", "rhythm", "market", "volatility", "crypto", "dca", "metronome", "buy", "sell", "yield", "hello", "hi"]
    is_valid = any(word in prompt_lower for word in keywords)

    # ==========================================
    # 2. 🧠 EL CEREBRO (Respuestas Exactas)
    # ==========================================
    if not is_valid:
        texto_oraculo = "My apologies. As the Oracle of The Metronome, my vision is strictly limited to Solana, USDC, and automated accumulation strategies. I cannot answer that."
    else:
        # 1. Respuesta para: "Analyze Solana volatility"
        if "analyze" in prompt_lower or "volatility" in prompt_lower:
            texto_oraculo = "Solana's volatility is your greatest asset. While emotional traders panic, The Metronome reads the market noise and executes precise buy orders at the bottom of the dip."
        
        # 2. Respuesta para: "What is the optimal DCA rhythm?"
        elif "optimal" in prompt_lower or "rhythm" in prompt_lower or "dca" in prompt_lower:
            texto_oraculo = "The optimal rhythm adapts to the market cycle. For current Solana conditions, I recommend setting a three percent Buy Drop to accumulate, and a five percent Sell Pump to secure profits."
        
        # 3. Respuesta para: "Explain The Metronome"
        elif "explain" in prompt_lower or "metronome" in prompt_lower:
            texto_oraculo = "The Metronome is an elite, fully automated accumulation protocol built on Solana. You set your rhythm, fund your vault, and our smart contracts handle the rest, buying dips and selling pumps twenty four seven."
        
        # Respuesta comodín por si escriben otra cosa válida
        else:
            texto_oraculo = "The on-chain data aligns with your query. Stay disciplined, trust the system, and let The Metronome automate your gains."
    # ==========================================
    # 3. 🎬 CONEXIÓN CON RUNWAY (Avatar Videos)
    # ==========================================
    # Usamos la URL correcta de DEV y el endpoint de AVATAR_VIDEOS
    url = "https://api.dev.runwayml.com/v1/avatar_videos" 
    headers = {
        "Authorization": f"Bearer {runway_key}",
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06"
    }

    # Esta es la estructura exacta que pide la documentación para Custom Avatars
    payload = {
        "model": "gwm1_avatars",
        "avatar": {
            "type": "custom",
            "avatarId": "bc7d4c56-0b13-47a3-82c9-38ade18cd3ef"
        },
        "speech": {
            "type": "text",
            "text": texto_oraculo
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        
        if response.status_code != 200:
            return {"text": f"⚠️ Error de Runway: {response_data}", "video": None}

        task_id = response_data.get("id")

        video_url = ""
        # Polling: consultamos el estado de la tarea en la URL de dev
        status_url = f"https://api.dev.runwayml.com/v1/tasks/{task_id}"

        while True:
            status_response = requests.get(status_url, headers=headers).json()
            estado = status_response.get("status")
            
            if estado == "SUCCEEDED":
                outputs = status_response.get("output", [])
                if isinstance(outputs, list) and len(outputs) > 0:
                    video_url = outputs[0]
                else:
                    video_url = str(outputs)
                break
            
            elif estado in ["FAILED", "CANCELLED"]:
                return {"text": f"⚠️ Runway falló al animar el avatar. Estado: {estado}", "video": None}
            
            time.sleep(3) 
        
        return {
            "text": texto_oraculo,
            "video": video_url 
        }

    except Exception as e:
        return {
            "text": f"⚠️ Error en la Matrix de IA: {str(e)}",
            "video": None
        }