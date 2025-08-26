// src/app/services/onnx.service.ts
import { Injectable } from '@angular/core';
import * as ort from 'onnxruntime-web';

@Injectable({
  providedIn: 'root'
})
export class OnnxService {
  private session: ort.InferenceSession | null = null;

  constructor() {
    // Configure ONNX wasm location (must match where you copied .wasm files)
    ort.env.wasm.wasmPaths = "assets/onnx/";
  }

  /** Load the ONNX model */
  async loadModel(modelPath: string = "assets/models/best.onnx") {
    if (this.session) return this.session; // prevent reloading

    try {
      this.session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['wasm'], // use WebAssembly backend
      });
      console.log("✅ ONNX model loaded:", modelPath);
      return this.session;
    } catch (err) {
      console.error("❌ Failed to load ONNX model:", err);
      throw err;
    }
  }

  /** Run inference on an input tensor */
  async predict(inputTensor: ort.Tensor): Promise<ort.InferenceSession.OnnxValueMapType | null> {
    if (!this.session) {
      throw new Error("Model is not loaded. Call loadModel() first.");
    }

    try {
      const feeds: Record<string, ort.Tensor> = {};
      feeds[this.session.inputNames[0]] = inputTensor;

      const results = await this.session.run(feeds);
      console.log("✅ Inference result:", results);
      return results;
    } catch (err) {
      console.error("❌ Prediction error:", err);
      return null;
    }
  }
}
