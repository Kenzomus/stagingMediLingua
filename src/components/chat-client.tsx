
"use client";

import type { FormEvent } from 'react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Send, Bot, User, Volume2, Loader2, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

import { answerMedicalQuestionWolof } from '@/ai/flows/medical-question-wolof';
import { medicalQuestionFrench } from '@/ai/flows/medical-question-french';
import { medicalQuestionEnglish } from '@/ai/flows/medical-question-english';
import { audioMedicalQuestion } from '@/ai/flows/audio-medical-question';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  audioUrl?: string; // For user's recorded audio
  language: Language;
  isTyping?: boolean;
  timestamp: Date;
}

type Language = 'en' | 'fr' | 'wo';

const languageMap: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  wo: 'Wolof',
};

const languagePlaceholders: Record<Language, string> = {
  en: 'Type your question in English...',
  fr: 'Tapez votre question en Français...',
  wo: 'Bindal sa laaj ci Wolof...',
};

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { isRecording, startRecording, stopRecording, audioDataUri, resetRecording } = useAudioRecorder();
  const { speak, cancel, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounterRef = useRef(0); // To ensure unique message IDs

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTo({ top: scrollViewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const uniqueId = `${Date.now()}-${messageIdCounterRef.current++}`;
    setMessages(prev => [...prev, { ...message, id: uniqueId, timestamp: new Date() }]);
  };

  const handleTextSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    addMessage({ sender: 'user', text: userText, language: selectedLanguage });
    setInputValue('');
    setIsLoading(true);
    setError(null);

    addMessage({ sender: 'bot', isTyping: true, language: selectedLanguage });

    try {
      let response;
      if (selectedLanguage === 'en') {
        response = await medicalQuestionEnglish({ question: userText });
      } else if (selectedLanguage === 'fr') {
        response = await medicalQuestionFrench({ question: userText });
      } else {
        response = await answerMedicalQuestionWolof({ question: userText });
      }
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage({ sender: 'bot', text: response.answer, language: selectedLanguage });
    } catch (err) {
      console.error("Error processing text message:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get response: ${errorMessage}`);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage({ sender: 'bot', text: `Sorry, I couldn't process your request. ${errorMessage}`, language: selectedLanguage });
      toast({
        title: "Error",
        description: `Failed to get response: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioSubmit = async () => {
    if (!audioDataUri) {
      toast({ title: "Audio Error", description: "No audio data to submit.", variant: "destructive" });
      return;
    }

    addMessage({ sender: 'user', text: "🎤 Processing audio...", audioUrl: audioDataUri, language: selectedLanguage });
    setIsLoading(true);
    setError(null);
    resetRecording(); // Reset audioDataUri after using it

    addMessage({ sender: 'bot', isTyping: true, language: selectedLanguage });

    try {
      const { transcription } = await audioMedicalQuestion({ audioDataUri });
      
      // Update user message with transcription
      setMessages(prev => prev.map(msg => 
        msg.audioUrl === audioDataUri && msg.sender === 'user' 
        ? { ...msg, text: `🎤 Transcription: "${transcription}"` } 
        : msg
      ));
      
      let response;
      if (selectedLanguage === 'en') {
        response = await medicalQuestionEnglish({ question: transcription });
      } else if (selectedLanguage === 'fr') {
        response = await medicalQuestionFrench({ question: transcription });
      } else {
        response = await answerMedicalQuestionWolof({ question: transcription });
      }
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage({ sender: 'bot', text: response.answer, language: selectedLanguage });

    } catch (err) {
      console.error("Error processing audio message:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred processing audio.";
      setError(`Audio processing failed: ${errorMessage}`);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      addMessage({ sender: 'bot', text: `Sorry, I couldn't process your audio. ${errorMessage}`, language: selectedLanguage });
      toast({
        title: "Audio Processing Error",
        description: `Failed: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioDataUri && !isRecording) {
      handleAudioSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDataUri, isRecording]);


  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      toast({ title: "Recording Stopped", description: "Processing your audio..." });
    } else {
      startRecording();
      toast({ title: "Recording Started", description: "Speak your question." });
    }
  };

  const handleSpeak = (text: string, lang: Language) => {
    if (isSpeaking) {
      cancel();
    }
    if (!ttsSupported(lang)) {
       toast({
        title: "TTS Not Supported",
        description: `Text-to-speech is not available for ${languageMap[lang]} in your browser.`,
        variant: "destructive",
      });
      return;
    }
    speak(text, lang);
  };

  return (
    <Card className="flex flex-col w-full h-full shadow-2xl rounded-lg overflow-hidden border-primary/20 border-2">
      <CardHeader className="p-4 border-b bg-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">AI Medical Assistant</h2>
          <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
            <SelectTrigger className="w-[180px] bg-background shadow-sm">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="wo">Wolof</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <ScrollArea className="flex-grow p-4 bg-background" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex animate-fadeIn ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 shadow-sm">
                  <AvatarImage src={msg.sender === 'bot' ? '/bot-avatar.png' : '/user-avatar.png'} alt={msg.sender} />
                  <AvatarFallback className="bg-muted-foreground text-muted">
                    {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`p-3 rounded-xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground border border-border rounded-bl-none'
                  }`}
                >
                  {msg.isTyping ? (
                     <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                    </div>
                  ) : (
                    <>
                      {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                      {msg.audioUrl && msg.sender === 'user' && (
                        <audio controls src={msg.audioUrl} className="mt-2 w-full max-w-xs h-10" />
                      )}
                      {msg.sender === 'bot' && msg.text && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-1 h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => handleSpeak(msg.text!, msg.language)}
                          disabled={isSpeaking || !ttsSupported(msg.language)}
                          title={ttsSupported(msg.language) ? "Speak this message" : `TTS not supported for ${languageMap[msg.language]}`}
                        >
                          <Volume2 size={16} />
                        </Button>
                      )}
                       <p className="text-xs mt-1 opacity-70 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {error && (
            <div className="flex justify-start animate-fadeIn">
               <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive max-w-[75%]">
                <AlertTriangle size={20} />
                <p className="text-sm">{error}</p>
               </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <CardContent className="p-4 border-t bg-primary/5">
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={languagePlaceholders[selectedLanguage]}
            className="flex-grow text-base shadow-sm focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="shadow-md" title="Send message">
            {isLoading && messages.some(m => m.sender === 'user' && !m.audioUrl) ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </Button>
          <Button type="button" size="icon" onClick={toggleRecording} variant={isRecording ? "destructive" : "outline"} className="shadow-md" title={isRecording ? "Stop recording" : "Start recording"}>
             {isRecording ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
