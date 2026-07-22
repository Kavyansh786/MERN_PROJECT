/**
 * Landmark processing utilities for virtual try-on
 * Converts MediaPipe landmarks to Three.js coordinates
 */

// Face landmark indices for jewelry positioning
export const FACE_LANDMARKS = {
  // Earring positions
  LEFT_EAR: [234, 127, 162],
  RIGHT_EAR: [454, 356, 389],
  
  // Necklace positions
  CHIN: [152],
  JAW_LEFT: [172],
  JAW_RIGHT: [397],
  NECK_BASE: [18, 175], // Estimated neck position
  
  // Face orientation
  NOSE_TIP: [1],
  FOREHEAD: [9, 10],
  
  // Face bounds
  FACE_OUTLINE: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
};

// Hand landmark indices
export const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20,
  
  // Ring finger positions
  RING_FINGER_BASE: 13,
  RING_FINGER_MID: 14,
  RING_FINGER_TIP: 16
};

/**
 * Convert normalized MediaPipe coordinates to Three.js world coordinates
 */
export const convertToThreeJS = (landmark, videoWidth = 1280, videoHeight = 720) => {
  return {
    x: (landmark.x - 0.5) * 2, // Convert from [0,1] to [-1,1]
    y: -(landmark.y - 0.5) * 2, // Flip Y axis and convert
    z: landmark.z ? landmark.z * 2 : 0 // Scale Z depth
  };
};

/**
 * Calculate necklace position from face landmarks
 */
export const calculateNecklacePosition = (faceLandmarks, videoWidth = 1280, videoHeight = 720) => {
  if (!faceLandmarks || faceLandmarks.length < 468) {
    return null;
  }

  try {
    // Get key landmarks
    const chin = faceLandmarks[FACE_LANDMARKS.CHIN[0]];
    const jawLeft = faceLandmarks[FACE_LANDMARKS.JAW_LEFT[0]];
    const jawRight = faceLandmarks[FACE_LANDMARKS.JAW_RIGHT[0]];
    
    if (!chin || !jawLeft || !jawRight) {
      return null;
    }

    // Calculate jaw center
    const jawCenter = {
      x: (jawLeft.x + jawRight.x) / 2,
      y: (jawLeft.y + jawRight.y) / 2,
      z: (jawLeft.z + jawRight.z) / 2
    };

    // Position necklace below chin
    const neckOffset = 0.08; // Adjust based on necklace type
    const necklacePosition = {
      x: jawCenter.x,
      y: chin.y + neckOffset,
      z: jawCenter.z
    };

    // Convert to Three.js coordinates
    const position = convertToThreeJS(necklacePosition, videoWidth, videoHeight);

    // Calculate scale based on jaw width
    const jawWidth = Math.sqrt(
      Math.pow(jawLeft.x - jawRight.x, 2) +
      Math.pow(jawLeft.y - jawRight.y, 2)
    );
    const scale = Math.max(jawWidth * 3.0, 0.5);

    // Calculate rotation based on jaw tilt
    const rotation = {
      x: 0,
      y: 0,
      z: Math.atan2(jawRight.y - jawLeft.y, jawRight.x - jawLeft.x)
    };

    return {
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z],
      scale: [scale, scale, scale],
      confidence: calculateConfidence(faceLandmarks, 'necklace')
    };
  } catch (error) {
    console.error('Error calculating necklace position:', error);
    return null;
  }
};

/**
 * Calculate earring positions from face landmarks
 */
export const calculateEarringPositions = (faceLandmarks, videoWidth = 1280, videoHeight = 720) => {
  if (!faceLandmarks || faceLandmarks.length < 468) {
    return null;
  }

  try {
    // Get ear landmarks
    const leftEarLandmarks = FACE_LANDMARKS.LEFT_EAR.map(idx => faceLandmarks[idx]);
    const rightEarLandmarks = FACE_LANDMARKS.RIGHT_EAR.map(idx => faceLandmarks[idx]);

    if (leftEarLandmarks.some(l => !l) || rightEarLandmarks.some(l => !l)) {
      return null;
    }

    // Calculate average ear positions
    const leftEarPos = leftEarLandmarks.reduce((acc, landmark) => ({
      x: acc.x + landmark.x / leftEarLandmarks.length,
      y: acc.y + landmark.y / leftEarLandmarks.length,
      z: acc.z + landmark.z / leftEarLandmarks.length
    }), { x: 0, y: 0, z: 0 });

    const rightEarPos = rightEarLandmarks.reduce((acc, landmark) => ({
      x: acc.x + landmark.x / rightEarLandmarks.length,
      y: acc.y + landmark.y / rightEarLandmarks.length,
      z: acc.z + landmark.z / rightEarLandmarks.length
    }), { x: 0, y: 0, z: 0 });

    // Convert to Three.js coordinates
    const leftPosition = convertToThreeJS(leftEarPos, videoWidth, videoHeight);
    const rightPosition = convertToThreeJS(rightEarPos, videoWidth, videoHeight);

    // Calculate scale based on face size
    const faceWidth = Math.abs(rightEarPos.x - leftEarPos.x);
    const scale = Math.max(faceWidth * 0.5, 0.3);

    // Calculate rotations
    const leftRotation = [0, 0, 0];
    const rightRotation = [0, Math.PI, 0]; // Mirror for right ear

    return {
      position: {
        left: [leftPosition.x, leftPosition.y, leftPosition.z],
        right: [rightPosition.x, rightPosition.y, rightPosition.z]
      },
      rotation: {
        left: leftRotation,
        right: rightRotation
      },
      scale: [scale, scale, scale],
      confidence: calculateConfidence(faceLandmarks, 'earrings')
    };
  } catch (error) {
    console.error('Error calculating earring positions:', error);
    return null;
  }
};

/**
 * Calculate ring positions from hand landmarks
 */
export const calculateRingPositions = (handResults, videoWidth = 1280, videoHeight = 720) => {
  if (!handResults.multiHandLandmarks || handResults.multiHandLandmarks.length === 0) {
    return null;
  }

  try {
    const positions = { left: null, right: null };
    const rotations = { left: [0, 0, 0], right: [0, 0, 0] };

    handResults.multiHandLandmarks.forEach((landmarks, index) => {
      const handedness = handResults.multiHandedness[index].label;
      const ringFingerBase = landmarks[HAND_LANDMARKS.RING_FINGER_BASE];
      const ringFingerMid = landmarks[HAND_LANDMARKS.RING_FINGER_MID];
      
      if (!ringFingerBase || !ringFingerMid) return;

      // Position ring at the base of ring finger
      const ringPosition = convertToThreeJS(ringFingerBase, videoWidth, videoHeight);
      
      // Calculate rotation based on finger direction
      const fingerDirection = {
        x: ringFingerMid.x - ringFingerBase.x,
        y: ringFingerMid.y - ringFingerBase.y,
        z: ringFingerMid.z - ringFingerBase.z
      };
      
      const rotation = [
        Math.atan2(fingerDirection.y, fingerDirection.z),
        Math.atan2(fingerDirection.x, fingerDirection.z),
        0
      ];

      if (handedness === 'Left') {
        positions.left = [ringPosition.x, ringPosition.y, ringPosition.z];
        rotations.left = rotation;
      } else {
        positions.right = [ringPosition.x, ringPosition.y, ringPosition.z];
        rotations.right = rotation;
      }
    });

    return {
      position: positions,
      rotation: rotations,
      scale: [0.3, 0.3, 0.3], // Standard ring scale
      confidence: calculateConfidence(handResults, 'rings')
    };
  } catch (error) {
    console.error('Error calculating ring positions:', error);
    return null;
  }
};

/**
 * Calculate confidence score for tracking quality
 */
export const calculateConfidence = (landmarks, jewelryType) => {
  if (!landmarks) return 0;

  try {
    switch (jewelryType) {
      case 'necklace':
        // Check if key face landmarks are detected
        const keyLandmarks = [152, 172, 397]; // chin, jaw left, jaw right
        const detectedCount = keyLandmarks.filter(idx => 
          landmarks[idx] && landmarks[idx].visibility > 0.5
        ).length;
        return detectedCount / keyLandmarks.length;

      case 'earrings':
        // Check ear region landmarks
        const earLandmarks = [...FACE_LANDMARKS.LEFT_EAR, ...FACE_LANDMARKS.RIGHT_EAR];
        const earDetectedCount = earLandmarks.filter(idx => 
          landmarks[idx] && landmarks[idx].visibility > 0.5
        ).length;
        return earDetectedCount / earLandmarks.length;

      case 'rings':
        // For hand landmarks, check if hands are detected
        if (landmarks.multiHandLandmarks) {
          return landmarks.multiHandLandmarks.length > 0 ? 0.8 : 0;
        }
        return 0;

      default:
        return 0.5;
    }
  } catch (error) {
    console.error('Error calculating confidence:', error);
    return 0;
  }
};

/**
 * Smooth position changes to reduce jitter
 */
export const smoothPosition = (currentPos, targetPos, smoothingFactor = 0.3) => {
  if (!currentPos || !targetPos) return targetPos;

  return currentPos.map((current, index) => 
    current + (targetPos[index] - current) * smoothingFactor
  );
};

/**
 * Check if landmarks are stable (not moving too much)
 */
export const isStable = (currentLandmarks, previousLandmarks, threshold = 0.02) => {
  if (!currentLandmarks || !previousLandmarks) return false;

  const movement = currentLandmarks.reduce((acc, current, index) => {
    const previous = previousLandmarks[index];
    if (!previous) return acc + threshold; // Consider unstable if landmark missing
    
    const distance = Math.sqrt(
      Math.pow(current.x - previous.x, 2) +
      Math.pow(current.y - previous.y, 2) +
      Math.pow(current.z - previous.z, 2)
    );
    
    return acc + distance;
  }, 0);

  const averageMovement = movement / currentLandmarks.length;
  return averageMovement < threshold;
};