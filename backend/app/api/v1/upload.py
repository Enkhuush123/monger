import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Утас эсвэл компьютерээс зураг шууд хуулах API
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Файлын нэр олдсонгүй")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Зөвшөөрөгдөөгүй файлын төрөл: {ext}. Зөвхөн JPG, PNG, WEBP, GIF зөвшөөрөгдөнө."
        )

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex[:12]}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Файлын хэмжээ 15MB-аас хэтрэхгүй байх ёстой.")
        
        with open(file_path, "wb") as f:
            f.write(content)

        file_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"
        return {
            "success": True,
            "filename": unique_filename,
            "url": file_url,
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Зураг хадгалахад алдаа гарлаа: {str(e)}")
