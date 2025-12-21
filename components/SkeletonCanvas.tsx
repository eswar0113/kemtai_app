import { useEffect, useRef } from "react";
import { Keypoint } from "@tensorflow-models/pose-detection";
import { drawKeypoints, drawSkeleton } from "@/lib/drawUtils";

type Props = {
  keypoints: Keypoint[];
  width: number;
  height: number;
};

export default function SkeletonCanvas({ keypoints, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    drawSkeleton(ctx, keypoints);
    drawKeypoints(ctx, keypoints);
  }, [keypoints, width, height]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}



