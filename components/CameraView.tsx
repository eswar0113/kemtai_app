/* Core camera + pose pipeline: grabs webcam, runs MoveNet, smooths keypoints, feeds exercise logic. */
import { useEffect, useRef, useState } from "react";
import { Keypoint } from "@tensorflow-models/pose-detection";
import SkeletonCanvas from "./SkeletonCanvas";
import { estimate, loadDetector } from "@/lib/poseDetector";
import { ExerciseResult } from "@/lib/exerciseLogic/BaseExercise";
import { SquatLogic } from "@/lib/exerciseLogic/squatLogic";
import { PushupLogic } from "@/lib/exerciseLogic/pushupLogic";
import { JumpingJackLogic } from "@/lib/exerciseLogic/jumpingJackLogic";
import { LungeLogic } from "@/lib/exerciseLogic/lungeLogic";
import { HeadRotationLogic } from "@/lib/exerciseLogic/headRotationLogic";

type Props = {
  exercise: "squat" | "pushup" | "lunge" | "jumpingjack" | "headrotation";
  onResult: (result: ExerciseResult) => void;
};

const SMOOTH_WINDOW = 4;

export default function CameraView({ exercise, onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logic] = useState(() => {
    switch (exercise) {
      case "pushup":
        return new PushupLogic();
      case "lunge":
        return new LungeLogic();
      case "jumpingjack":
        return new JumpingJackLogic();
      case "headrotation":
        return new HeadRotationLogic();
      default:
        return new SquatLogic();
    }
  });
  const smoothBuffer = useRef<Keypoint[][]>([]);
  const startCameraRef = useRef<(() => Promise<void>) | null>(null);
  const cameraInitialized = useRef<string | null>(null);
  const onResultRef = useRef(onResult);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Keep onResult ref updated without triggering re-renders
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    // Only initialize camera once per exercise
    if (cameraInitialized.current === exercise) {
      return;
    }
    
    let raf: number;
    let active = true;

    const startCamera = async () => {
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.");
        }

        setLoading(true);
        setError(null);
        
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: "user" // Front-facing camera
          } 
        });
        
        // Store stream in ref for cleanup
        streamRef.current = stream;
        
        if (!videoRef.current || !active) {
          stream.getTracks().forEach(track => track.stop());
          streamRef.current = null;
          return;
        }
        
        // Mark as initialized before setting stream (prevents re-initialization)
        cameraInitialized.current = exercise;
        
        // Set srcObject and wait for video to be ready
        videoRef.current.srcObject = stream;
        
        // Wait for video metadata to load
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not available"));
            return;
          }
          
          const video = videoRef.current;
          
          const handleLoadedMetadata = () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            resolve();
          };
          
          const handleError = () => {
            video.removeEventListener("error", handleError);
            reject(new Error("Video load error"));
          };
          
          video.addEventListener("loadedmetadata", handleLoadedMetadata);
          video.addEventListener("error", handleError);
          
          // If already loaded, resolve immediately
          if (video.readyState >= 1) {
            resolve();
          }
        });
        
        // Play video with error handling
        try {
          await videoRef.current.play();
        } catch (playError) {
          // Ignore play() interruption errors - video will play when ready
          console.warn("Video play() interrupted:", playError);
        }
        
        // Load detector after video is ready
        await loadDetector();
        
        if (!active) return;
        
        const loop = async () => {
          if (!active || !videoRef.current) return;
          try {
            const poses = await estimate(videoRef.current);
            const kps = poses[0]?.keypoints ?? [];
            const smoothed = smoothKeypoints(kps);
            setKeypoints(smoothed);
            const result = logic.update({ keypoints: smoothed, timestamp: performance.now() });
            onResultRef.current(result);
          } catch (error) {
            console.error("Pose estimation error:", error);
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        setLoading(false);
      } catch (error: any) {
        console.error("Camera initialization error:", error);
        setLoading(false);
        
        // Provide user-friendly error messages
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setError("Camera access was denied. Please allow camera access and refresh the page.");
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setError("No camera found. Please connect a camera and refresh the page.");
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          setError("Camera is already in use by another application. Please close other apps using the camera.");
        } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
          setError("Camera doesn't support the required settings. Trying with default settings...");
          // Try again with default settings
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current && active) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
              await loadDetector();
              setError(null);
              setLoading(false);
            }
          } catch (retryError) {
            setError("Failed to access camera. Please check your camera permissions and try again.");
          }
        } else {
          setError(error.message || "Failed to access camera. Please check your browser settings.");
        }
      }
    };

    const smoothKeypoints = (kps: Keypoint[]) => {
      smoothBuffer.current.unshift(kps);
      smoothBuffer.current = smoothBuffer.current.slice(0, SMOOTH_WINDOW);
      const averaged = kps.map((kp, idx) => {
        const points = smoothBuffer.current.map((frame) => frame[idx] ?? kp);
        const x = points.reduce((sum, p) => sum + (p?.x ?? 0), 0) / points.length;
        const y = points.reduce((sum, p) => sum + (p?.y ?? 0), 0) / points.length;
        const score = points.reduce((sum, p) => sum + (p?.score ?? 0), 0) / points.length;
        return { ...kp, x, y, score };
      });
      return averaged;
    };

    // Store the function in ref so it can be called from button
    startCameraRef.current = startCamera;
    
    startCamera();
    
    return () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      
      // Stop stream if it exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        const video = videoRef.current;
        // Pause video first
        video.pause();
        // Stop all tracks
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach((t) => t.stop());
        }
        // Clear srcObject
        video.srcObject = null;
      }
      
      // Reset initialization flag when cleanup runs
      cameraInitialized.current = null;
    };
  }, [exercise, logic]); // Removed onResult from dependencies

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Requesting camera access...</p>
            <p className="text-sm text-gray-400 mt-2">Please allow camera access when prompted</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center text-white p-6 max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-lg font-semibold mb-2">Camera Error</p>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                if (startCameraRef.current) {
                  startCameraRef.current();
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
      {!error && <SkeletonCanvas keypoints={keypoints} width={640} height={480} />}
    </div>
  );
}



