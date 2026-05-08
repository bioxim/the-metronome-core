import modal
import os

app = modal.App("metronome-oracle-backend")

image = modal.Image.debian_slim().pip_install("runwayml", "fastapi[standard]")

@app.function(
    image=image, 
    secrets=[modal.Secret.from_name("runway-key")],
    timeout=300 
)
@modal.fastapi_endpoint(method="POST")
def generate_oracle_video(item: dict):
    from runwayml import RunwayML
    import time

    prompt = item.get("prompt", "")
    
    prompt_lower = prompt.lower()
    is_valid = any(word in prompt_lower for word in ["sol", "usdc", "rhythm", "market", "volatility", "crypto"])

    if not is_valid:
        return {
            "text": "My apologies. As the Oracle of The Metronome, my expertise is strictly limited to Solana, USDC, and DCA strategies.",
            "video": "https://www.w3schools.com/html/mov_bbb.mp4" 
        }

    runway_key = os.environ.get("RUNWAY_API_KEY")
    if not runway_key:
        return {
            "text": "⚠️ ERROR: Sigo sin encontrar la llave. ¡Revisemos la bóveda!",
            "video": None
        }

    try:
        client = RunwayML(api_key=runway_key)
        
        texto_oraculo = "Analyzing Solana market conditions... Volatility is optimal. I recommend setting a 2% Buy Drop rhythm."
        
        # 👇 ¡IMPORTANTE! Reemplazá estas URLs por enlaces públicos reales 👇
        url_imagen_oso = "https://tu-sitio.com/oso.jpg" 
        url_video_referencia = "https://tu-sitio.com/video-referencia.mp4"
        
        # Usamos el endpoint correcto para controlar personajes (Lip Sync)
        task = client.character_performance.create(
            model="act_two",
            character={
                "type": "image",
                "uri": url_imagen_oso
            },
            reference={
                "type": "video",
                "uri": url_video_referencia
            },
            ratio="1280:720"
        )

        task_id = task.id
        video_url = ""
        
        while True:
            task_info = client.tasks.retrieve(task_id)
            
            if task_info.status == "SUCCEEDED":
                if isinstance(task_info.output, list) and len(task_info.output) > 0:
                    video_url = task_info.output[0]
                else:
                    video_url = str(task_info.output)
                break
            elif task_info.status in ["FAILED", "CANCELLED"]:
                return {
                    "text": f"⚠️ Runway falló al generar el video. Estado: {task_info.status}",
                    "video": None
                }
            
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