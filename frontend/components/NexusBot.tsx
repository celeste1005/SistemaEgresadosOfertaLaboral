"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { trpc } from '@/lib/trpc';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface Message {
  text: string;
  isBot: boolean;
  isAnalysis?: boolean;
}

export function NexusBot({ role }: { role: 'ADMIN' | 'EGRESADO' | 'EMPRESA' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: `¡Hola! Soy NexusBot. ¿En qué puedo ayudarte con tu gestión como ${role.toLowerCase()}?`, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chatWithNexusBot.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleNotifications = () => {
    if (!isNotificationsActive) {
      const socket = io('http://localhost:3006'); // Cambiar por URL de producción si es necesario
      socketRef.current = socket;

      socket.on('connect', () => {
        toast.success('Notificaciones en tiempo real activadas');
        setIsNotificationsActive(true);
      });

      socket.on('notification', (data) => {
        toast.info(data.message || 'Nueva notificación');
      });

      socket.on('broadcast', (data) => {
        toast('Aviso General', { description: data.message });
      });
    } else {
      socketRef.current?.disconnect();
      setIsNotificationsActive(false);
      toast.error('Notificaciones desactivadas');
    }
  };

  const handleSend = async (e?: React.FormEvent, isAnalysisRequest = false) => {
    e?.preventDefault();
    const messageText = isAnalysisRequest ? "Generar análisis estratégico de datos" : input;
    if (!messageText.trim()) return;

    const userMsg = { text: messageText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const result = await chatMutation.mutateAsync({
        message: messageText,
        context: role,
        includeAnalysis: isAnalysisRequest
      });

      setMessages(prev => [...prev, { 
        text: result.response, 
        isBot: true,
        isAnalysis: isAnalysisRequest
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Lo siento, tuve un problema al procesar tu solicitud.", isBot: true }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Botón de Notificaciones */}
      <button
        onClick={toggleNotifications}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group ${
          isNotificationsActive ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-indigo-600'
        }`}
      >
        <Bell className={`w-5 h-5 ${isNotificationsActive ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
        {isOpen && <span className="text-xs font-bold pr-2">{isNotificationsActive ? 'Activas' : 'Activar Avisos'}</span>}
      </button>

      {/* Ventana del Chat */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">NexusBot IA</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">En línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  msg.isBot 
                    ? msg.isAnalysis ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 font-medium' : 'bg-slate-100 text-slate-700' 
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                }`}>
                  {msg.isAnalysis && <Sparkles className="w-4 h-4 mb-2 text-indigo-500" />}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-50 space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => handleSend(undefined, true)}
                className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-full border border-slate-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                Análisis de Datos
              </button>
            </div>
            <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame algo..."
                className="h-11 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Botón Flotante Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative"
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-20" />
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </button>
    </div>
  );
}
