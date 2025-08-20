import os
from dotenv import load_dotenv
from roboflow import Roboflow

load_dotenv()

RF_API_KEY  = os.getenv("RF_API_KEY")
WORKSPACE   = os.getenv("RF_WORKSPACE")
PROJECT     = os.getenv("RF_PROJECT")
VERSION     = int(os.getenv("RF_VERSION", "1"))

print(">> Downloading dataset from Roboflow...")
rf = Roboflow(api_key=RF_API_KEY)
project = rf.workspace(WORKSPACE).project(PROJECT)
version = project.version(VERSION)
dataset = version.download("folder") 
print("✅ Dataset downloaded to:", dataset.location)
