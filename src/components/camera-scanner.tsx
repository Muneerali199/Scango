
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Upload, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CameraScannerProps {
  onScan: (imageDataUri: string) => void;
  disabled?: boolean;
}

export default function CameraScanner({ onScan, disabled }: CameraScannerProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error("Camera not supported by this browser.");
        setHasCameraPermission(false);
        toast.error('Your browser does not support camera access.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast.error('Please enable camera permissions in your browser settings.');
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !hasCameraPermission) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL("image/jpeg");
      onScan(dataUri);
    }
  }, [onScan, hasCameraPermission]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          onScan(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="overflow-hidden">
        <div className="relative aspect-video w-full bg-muted">
            <video
                ref={videoRef}
                className={`w-full h-full object-cover ${hasCameraPermission ? 'block' : 'hidden'}`}
                autoPlay
                playsInline
                muted
            />
            {!hasCameraPermission && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Awaiting Camera Permission</h3>
                    <p className="text-muted-foreground">Please grant permission to use your camera for scanning.</p>
                </div>
            )}
            {hasCameraPermission && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-1/2 border-4 border-white/50 rounded-lg shadow-lg backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <ScanLine className="h-16 w-16 text-white/80 animate-pulse" />
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="border-t p-4 bg-background/80 space-y-4">
            {hasCameraPermission === false && (
                 <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        To scan products, please allow access to your camera in your browser's settings. You can still upload an image instead.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={captureFrame} disabled={disabled || !hasCameraPermission} className="w-full text-lg h-12">
                <Camera className="mr-2 h-6 w-6" />
                Scan Product
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={disabled} className="w-full text-lg h-12">
                <Upload className="mr-2 h-6 w-6" />
                Upload Image
                </Button>
            </div>
        </div>
    </Card>
  );
}
