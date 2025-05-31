
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, AlertTriangle, UserCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function VideoConsultationPage() {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        setHasCameraPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera/microphone:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(prev => !prev);
      toast({
        title: `Microphone ${!isMicMuted ? 'Muted' : 'Unmuted'}`,
      });
    }
  };

  const toggleCamera = () => {
     if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev);
       toast({
        title: `Camera ${!isCameraOff ? 'Off' : 'On'}`,
      });
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setHasCameraPermission(null); 
    toast({
      title: 'Call Ended',
      description: 'The video consultation has been terminated.',
    });
     if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-xl border-primary/20">
        <CardHeader className="items-center text-center bg-primary/10 p-6 rounded-t-lg">
          <VideoIcon className="h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Video Consultation</CardTitle>
          <CardDescription className="text-lg">
            Connecting you securely with your healthcare provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera & Microphone Access Required</AlertTitle>
              <AlertDescription>
                Please enable camera and microphone permissions in your browser settings to use video consultation. Refresh the page after enabling.
              </AlertDescription>
            </Alert>
          )}
          
          <Alert variant="default" className="bg-accent/10 border-accent/30">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent">Connected Doctors Only</AlertTitle>
            <AlertDescription>
              This video consultation feature is intended for use with doctors you are already connected with through the platform. Full connection management is under development.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 bg-muted rounded-lg aspect-video flex items-center justify-center relative overflow-hidden border">
              <Image 
                src="https://placehold.co/600x400.png/E0E0E0/B0B0B0" 
                alt="Remote Video Feed Placeholder"
                layout="fill"
                objectFit="cover"
                data-ai-hint="video call screen"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4">
                <UserCircle className="h-24 w-24 text-white/50 mb-4" />
                <p className="text-white/80 text-lg font-medium">Doctor's Video (Placeholder)</p>
                <p className="text-white/60 text-sm">Waiting for participant to join...</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg aspect-video relative overflow-hidden border">
                {hasCameraPermission === true && !isCameraOff ? (
                  <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-muted-foreground/20">
                     <VideoOff className="h-16 w-16 text-muted-foreground mb-2" />
                     <p className="text-sm text-muted-foreground p-2 text-center">
                        {hasCameraPermission === null && "Initializing camera..."}
                        {hasCameraPermission === false && "Camera access denied."}
                        {hasCameraPermission === true && isCameraOff && "Camera is off."}
                     </p>
                  </div>
                )}
              </div>
              <Card className="p-4 shadow-md">
                <CardTitle className="text-lg mb-3 text-center">Controls</CardTitle>
                <div className="flex justify-around items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMicrophone}
                    disabled={hasCameraPermission !== true}
                    className="rounded-full w-12 h-12"
                    aria-label={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                  >
                    {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleCamera}
                    disabled={hasCameraPermission !== true}
                    className="rounded-full w-12 h-12"
                    aria-label={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                  >
                    {isCameraOff ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleEndCall}
                    className="rounded-full w-12 h-12"
                    aria-label="End Call"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
           <div className="text-center pt-4 text-muted-foreground text-sm">
            Note: This is a UI demonstration. Actual video call functionality (peer-to-peer connection) and doctor connection system are not yet implemented.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    