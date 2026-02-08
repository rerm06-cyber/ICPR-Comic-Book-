
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { ComicFace } from './types';

interface EditModalProps {
    face: ComicFace | null;
    onClose: () => void;
    onSave: (instruction: string, refImageBase64?: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ face, onClose, onSave }) => {
    const [instruction, setInstruction] = useState('');
    const [refImage, setRefImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    if (!face) return null;

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Tu navegador no soporta reconocimiento de voz.");
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-PR';
        recognition.interimResults = false;
        
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInstruction(prev => prev ? prev + ' ' + transcript : transcript);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = () => setIsRecording(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setRefImage((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                
                {/* Left: Preview */}
                <div className="md:w-1/2 bg-gray-900 relative flex items-center justify-center">
                    <img src={face.imageUrl} className="max-h-full object-contain" alt="Preview" />
                    <div className="absolute top-4 left-4 bg-icpr-blue text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Editando Página {face.pageIndex}
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="md:w-1/2 p-8 flex flex-col gap-6 overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-montserrat font-extrabold text-icpr-blue uppercase tracking-tighter">Refinar Escena</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-icpr-ruby text-2xl">✕</button>
                    </div>

                    <p className="text-xs text-gray-500 font-opensans">
                        Indica qué cambios visuales deseas. Los personajes de **René** e **Ivonne** mantendrán su consistencia master.
                    </p>

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-[10px] font-montserrat font-extrabold text-icpr-blue uppercase mb-2 tracking-widest opacity-70">Instrucción por Texto o Voz</label>
                            <textarea 
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                placeholder="Ej: Cambia el fondo a una puesta de sol en la playa..."
                                className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-opensans text-sm focus:border-icpr-magenta outline-none transition-all resize-none"
                            />
                            <button 
                                onClick={handleVoiceInput}
                                className={`absolute bottom-4 right-4 p-3 rounded-full transition-all ${isRecording ? 'bg-icpr-ruby animate-pulse text-white' : 'bg-gray-200 text-gray-600 hover:bg-icpr-blue hover:text-white'}`}
                                title="Dictar instrucción"
                            >
                                <span className="text-lg">{isRecording ? '⏹️' : '🎤'}</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-montserrat font-extrabold text-icpr-blue uppercase mb-2 tracking-widest opacity-70">Imagen de Referencia (Opcional)</label>
                            <div className="flex gap-4 items-center">
                                <label className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-icpr-green bg-gray-50 transition-all cursor-pointer text-center">
                                    <span className="text-xl mb-1 block">🖼️</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sube referencia</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleRefImageUpload} />
                                </label>
                                {refImage && (
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-icpr-green relative group">
                                        <img src={`data:image/png;base64,${refImage}`} className="w-full h-full object-cover" />
                                        <button onClick={() => setRefImage(null)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">✕</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-400 font-montserrat font-bold text-xs uppercase tracking-widest hover:bg-gray-50">Cancelar</button>
                        <button 
                            onClick={() => onSave(instruction, refImage || undefined)}
                            disabled={!instruction.trim() && !refImage}
                            className="flex-1 py-4 rounded-xl bg-icpr-magenta text-white font-montserrat font-extrabold text-xs uppercase tracking-[0.2em] shadow-xl hover:brightness-110 disabled:opacity-50 active:scale-95 transition-all"
                        >
                            Aplicar Edición
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
