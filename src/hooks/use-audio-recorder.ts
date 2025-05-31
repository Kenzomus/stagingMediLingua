"use client";

import { useState, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioDataUri(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop microphone tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioDataUri(null); // Reset previous audio data
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not start audio recording. Please check microphone permissions.',
        variant: 'destructive',
      });
      setIsRecording(false); // Ensure isRecording is false if start fails
    }
  }, [isRecording, toast]);

  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setAudioDataUri(null);
    audioChunksRef.current = [];
    if (isRecording) {
        stopRecording();
    }
  }, [isRecording, stopRecording]);

  return { isRecording, startRecording, stopRecording, audioDataUri, resetRecording };
}
