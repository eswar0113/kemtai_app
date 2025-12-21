import { Keypoint } from "@tensorflow-models/pose-detection";

/**
 * Utility functions for calculating angles from pose keypoints
 * 
 * Calculates the angle at a joint formed by three keypoints
 * @param point1 First point (before the joint)
 * @param joint The joint point (vertex of the angle)
 * @param point2 Second point (after the joint)
 * @returns The angle in degrees, or null if any keypoint is missing
 */
export function getAngleAtJoint(
  point1: Keypoint | undefined,
  joint: Keypoint | undefined,
  point2: Keypoint | undefined
): number | null {
  if (!point1 || !joint || !point2) return null;
  if (point1.score === undefined || joint.score === undefined || point2.score === undefined) return null;
  if (point1.score < 0.3 || joint.score < 0.3 || point2.score < 0.3) return null;

  // Calculate vectors from joint to each point
  const vec1 = {
    x: point1.x - joint.x,
    y: point1.y - joint.y
  };
  const vec2 = {
    x: point2.x - joint.x,
    y: point2.y - joint.y
  };

  // Calculate dot product and magnitudes
  const dot = vec1.x * vec2.x + vec1.y * vec2.y;
  const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);

  // Avoid division by zero
  if (mag1 === 0 || mag2 === 0) return null;

  // Calculate angle in radians, then convert to degrees
  const cosAngle = dot / (mag1 * mag2);
  // Clamp to [-1, 1] to avoid NaN from Math.acos
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angleRad = Math.acos(clampedCos);
  const angleDeg = (angleRad * 180) / Math.PI;

  return angleDeg;
}

/**
 * Calculates the average of an array of angles
 * @param angles Array of angles (can include null values)
 * @returns The average angle in degrees, or null if no valid angles
 */
export function averageAngle(angles: (number | null)[]): number | null {
  const validAngles = angles.filter((angle): angle is number => angle !== null);
  if (validAngles.length === 0) return null;
  
  const sum = validAngles.reduce((acc, angle) => acc + angle, 0);
  return sum / validAngles.length;
}

