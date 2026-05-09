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
    
    # 🛡️ GUARDRAILS
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
        
        # 👇 TU ENLACE INBLOQUEABLE. ¡CERO VIDEOS DE REFERENCIA! 👇
        url_imagen_oso = "https://private-user-images.githubusercontent.com/24918827/589976587-96903815-4368-4737-b850-e4d639c7308d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzgzMzQwNjksIm5iZiI6MTc3ODMzMzc2OSwicGF0aCI6Ii8yNDkxODgyNy81ODk5NzY1ODctOTY5MDM4MTUtNDM2OC00NzM3LWI4NTAtZTRkNjM5YzczMDhkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjA1MDklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTA5VDEzMzYwOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWQ5ZDRiY2Y1Nzc4ODU2YjdhMzZkYzJhNGYxNzNiYmMxY2RjNmQ2NDBjNTIwN2RjMzhjYTQ0OTU2Njk2NGYyNWImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnJlc3BvbnNlLWNvbnRlbnQtdHlwZT1pbWFnZSUyRnBuZyJ9.vxtKJynynKm-dIs0RwYsGFV1mvJvJVMjISKZJSj3NTE" 
        
        # Volvemos a usar el modelo de Imagen a Video (Solo necesita la foto y el texto)
        task = client.image_to_video.create(
            model="gen3a_turbo",
            prompt_image=url_imagen_oso,
            prompt_text=f"A hyper-realistic bear in a suit talking directly to the camera like a financial advisor. He is saying exactly this: {texto_oraculo}"
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