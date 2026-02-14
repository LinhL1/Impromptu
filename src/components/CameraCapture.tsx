import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, ImagePlus } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => cameraRef.current?.click()}
        className="flex h-28 w-28 items-center justify-center rounded-full gradient-warm shadow-soft text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none"
        aria-label="Take a photo"
      >
        <Camera className="h-10 w-10" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none"
        aria-label="Upload a photo from your device"
      >
        <ImagePlus className="h-4 w-4" />
        Upload from gallery
      </motion.button>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
        aria-hidden="true"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        aria-hidden="true"
      />
    </div>
  );
}
