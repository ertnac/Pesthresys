import os, json, shutil, pathlib, yaml
from dotenv import load_dotenv
from ultralytics import YOLO

load_dotenv()

ASSETS_DIR = os.getenv("FRONTEND_ASSETS_DIR", "../frontend/src/assets/models")
IMG_SIZE   = int(os.getenv("IMG_SIZE", "640"))

print(">> Looking for trained model...")
save_dir = pathlib.Path("runs/detect/train")
best_pt = save_dir / "weights" / "best.pt"

print(">> Exporting model to TFLite...")
exported = YOLO(str(best_pt)).export(format="tflite", nms=True, imgsz=IMG_SIZE)

weights_dir = save_dir / "weights"
tflites = list(weights_dir.glob("*.tflite"))
tflite_path = tflites[0]

print(">> Creating artifacts...")
artifacts = pathlib.Path("trainModel/artifacts")
artifacts.mkdir(exist_ok=True)

shutil.copy2(tflite_path, artifacts / "aphid_best.tflite")

# Create classes.json
data_yaml = "trainModel/datasets/data.yaml"
names = yaml.safe_load(open(data_yaml))["names"]
json.dump(names, open(artifacts / "classes.json", "w"))

# Copy to Ionic frontend
dest = pathlib.Path(ASSETS_DIR)
dest.mkdir(parents=True, exist_ok=True)
shutil.copy2(artifacts/"aphid_best.tflite", dest/"aphid_best.tflite")
shutil.copy2(artifacts/"classes.json", dest/"classes.json")

print("✅ Export complete. Model copied to:", dest.resolve())
