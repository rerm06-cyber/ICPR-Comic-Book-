
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace, Persona } from './types';

interface GalleryProps {
    isOpen: boolean;
    onClose: () => void;
    comicFaces: ComicFace[];
    hero: Persona | null;
    friend: Persona | null;
    onJumpToPage: (index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ isOpen, onClose, comicFaces, hero, friend, onJumpToPage }) => {
    return (
        <div className={`fixed inset-0 z-[300] bg-black/60 backdrop-blur-md transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 bg-icpr-blue text-white flex justify-between items-center border-b-4 border-icpr-green">
                    <div>
                        <h2 className="text-2xl font-montserrat font-extrabold uppercase tracking-tighter">Archivo de Saga</h2>
                        <p className="text-[10px] font-montserrat opacity-70 tracking-widest uppercase mt-1 italic">Edición 80 Aniversario ICPR</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <span className="text-2xl">✕</span>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-12 scrollbar-hide">
                    
                    {/* Visual Bible Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">💎</span>
                            <h3 className="text-sm font-montserrat font-extrabold text-icpr-blue uppercase tracking-widest">Visual Bible (Consistency Anchors)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Hero Anchor */}
                            <div className="space-y-2">
                                <div className="aspect-[2/3] bg-gray-100 rounded-2xl overflow-hidden border-2 border-icpr-magenta shadow-lg relative group">
                                    {hero?.visualAnchor ? (
                                        <img src={`data:image/png;base64,${hero.visualAnchor}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-6 text-center text-[10px] text-gray-400 font-bold uppercase italic">
                                            A la espera de la primera generación...
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 bg-icpr-magenta/90 text-white text-[8px] font-bold py-2 text-center uppercase tracking-widest">Master Lead Hero</div>
                                </div>
                            </div>
                            {/* Friend Anchor */}
                            <div className="space-y-2">
                                <div className="aspect-[2/3] bg-gray-100 rounded-2xl overflow-hidden border-2 border-icpr-green shadow-lg relative group">
                                    {friend?.visualAnchor ? (
                                        <img src={`data:image/png;base64,${friend.visualAnchor}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-6 text-center text-[10px] text-gray-400 font-bold uppercase italic">
                                            Buscando anclaje visual...
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 bg-icpr-green/90 text-white text-[8px] font-bold py-2 text-center uppercase tracking-widest">Strategic Partner</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* All Generations Grid */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">🖼️</span>
                            <h3 className="text-sm font-montserrat font-extrabold text-icpr-blue uppercase tracking-widest">Historial de Generaciones</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {comicFaces.map((face, i) => (
                                <div 
                                    key={face.id} 
                                    className={`relative aspect-[2/3] bg-gray-50 rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${face.imageUrl ? 'border-gray-200 shadow-md' : 'border-dashed border-gray-300'}`}
                                    onClick={() => face.imageUrl && onJumpToPage(i)}
                                >
                                    {face.imageUrl ? (
                                        <img src={face.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-icpr-blue border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {face.consistencyFlags && face.consistencyFlags.length > 0 && (
                                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] shadow-sm">⚠️</div>
                                        )}
                                        {face.imageUrl && !face.consistencyFlags && (
                                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[8px] shadow-sm text-white">✓</div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[7px] font-bold py-1 text-center uppercase">
                                        {face.type === 'cover' ? 'Portada' : face.type === 'back_cover' ? 'Final' : `Pág ${face.pageIndex}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-8 border-t bg-gray-50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-icpr-ruby flex items-center justify-center text-xl shadow-lg border-2 border-white">🎓</div>
                    <div>
                        <p className="text-[10px] font-montserrat font-bold text-gray-400 uppercase tracking-widest">Curaduría de Contenido</p>
                        <p className="text-xs font-montserrat font-extrabold text-icpr-blue uppercase">Protección de Consistencia Activa</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
