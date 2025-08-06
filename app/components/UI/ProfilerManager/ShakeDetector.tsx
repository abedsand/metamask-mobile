import { useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

interface ShakeDetectorProps {
  onShake: () => void;
  enabled: boolean;
  sensibility?: number;
}

const ShakeDetector: React.FC<ShakeDetectorProps> = ({
  onShake,
  enabled,
  sensibility = 1.8,
}) => {
  useEffect(() => {
    if (!enabled) return;

    // Configure shake detection
    Accelerometer.setUpdateInterval(100);

    const onUpdate = ({ x, y, z }: { x: number; y: number; z: number }) => {
      // Compute total acceleration (includes gravity)
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Detect shake when acceleration exceeds sensibility threshold
      if (acceleration >= sensibility) {
        onShake();
      }
    };

    // Subscribe to accelerometer updates
    const subscription = Accelerometer.addListener(onUpdate);

    return () => {
      // Clean up subscription
      Accelerometer.removeAllListeners();
    };
  }, [enabled, onShake, sensibility]);

  return null;
};

export default ShakeDetector;
