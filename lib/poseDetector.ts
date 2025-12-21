import * as posedetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let detector: posedetection.PoseDetector | null = null;
let backendInitialized = false;

const initializeBackend = async () => {
  if (backendInitialized) return;
  
  // Wait for TensorFlow to be ready
  await tf.ready();
  
  // Set WebGL backend explicitly (more reliable than WebGPU)
  await tf.setBackend("webgl");
  await tf.ready();
  
  backendInitialized = true;
};

export const loadDetector = async () => {
  if (detector) return detector;
  
  // Initialize backend before creating detector
  await initializeBackend();
  
  detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
    modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING
  });
  return detector;
};

export const estimate = async (video: HTMLVideoElement) => {
  if (!detector) detector = await loadDetector();
  return detector!.estimatePoses(video, {
    flipHorizontal: false,
    maxPoses: 1
  });
};

