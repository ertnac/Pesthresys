import os, pathlib
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

IMG_SIZE    = int(os.getenv("IMG_SIZE", "640"))
EPOCHS      = int(os.getenv("EPOCHS", "80"))
MODEL       = os.getenv("MODEL", "yolov8n.pt")

print(">> Training YOLOv8 model...")
yolo = YOLO(MODEL)
results = yolo.train(
    data="./datasets/data.yaml", 
    imgsz=IMG_SIZE,
    epochs=EPOCHS,
    batch=16,
    patience=20,
)

save_dir = getattr(yolo.trainer, "save_dir", pathlib.Path("runs/detect/train"))
best_pt = pathlib.Path(save_dir) / "weights" / "best.pt"
print("✅ Training finished. Best model at:", best_pt)
