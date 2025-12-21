import { Keypoint } from "@tensorflow-models/pose-detection";

const pairs: Array<[number, number]> = [
  [0, 1],
  [1, 3],
  [0, 2],
  [2, 4],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10],
  [5, 6],
  [5, 11],
  [6, 12],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16]
];

export const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[], minScore = 0.5) => {
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(14,165,233,0.9)";
  pairs.forEach(([a, b]) => {
    const kp1 = keypoints[a];
    const kp2 = keypoints[b];
    if (kp1 && kp2 && (kp1.score ?? 0) > minScore && (kp2.score ?? 0) > minScore) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.stroke();
    }
  });
};

export const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[], minScore = 0.5) => {
  keypoints.forEach((kp) => {
    if (kp && (kp.score ?? 0) > minScore) {
      ctx.fillStyle = "rgba(124,58,237,0.9)";
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
};



