
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ComicFace } from './types';
import { LoadingFX } from './LoadingFX';

interface PanelProps {
    face?: ComicFace;
    allFaces: ComicFace[];
    onChoice: (pageIndex: number, choice: string) => void;
    onOpenBook: () => void;
    onDownload: () => void;
    onReset: () => void;
    onEditPage?: (face: ComicFace) => void;
}

export const Panel: React.FC<PanelProps> = ({ face, allFaces, onChoice, onOpenBook, onDownload, onReset, onEditPage }) => {
    if (!face) return <div className="w-full h-full bg-icpr-blue/5 flex items-center justify-center font-montserrat text-[10px] text-gray-300 uppercase tracking-widest font-bold">Página Reservada</div>;
    
    if (face.isLoading && !face.imageUrl) return <LoadingFX />;
    
    const isFullBleed = face.type === 'cover' || face.type === 'back_cover';

    return (
        <div className={`panel-container relative group h-full w-full overflow-hidden ${isFullBleed ? '!p-0 !bg-[#050505]' : 'bg-white p-2 border-r border-gray-100'}`}>
            <div className="gloss absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 to-white/10 opacity-30 z-10"></div>
            
            {face.imageUrl ? (
                <img src={face.imageUrl} alt={`Página ${face.pageIndex}`} className={`panel-image w-full h-full ${isFullBleed ? 'object-cover' : 'object-contain'} transition-transform duration-1000 group-hover:scale-[1.01]`} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8 text-center gap-4">
                    <div className="w-12 h-12 border-4 border-icpr-blue/20 border-t-icpr-blue rounded-full animate-spin"></div>
                    <p className="font-montserrat text-xs text-icpr-blue font-bold uppercase tracking-widest">Renderizando Magia 3D...</p>
                </div>
            )}

            {/* Edit Button */}
            {face.imageUrl && !face.isLoading && onEditPage && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditPage(face); }}
                  className="absolute top-4 right-4 z-[30] bg-white/90 hover:bg-icpr-magenta hover:text-white text-icpr-blue p-2 rounded-full shadow-lg transition-all border border-gray-200"
                  title="Editar esta página"
                >
                  <span className="text-sm">🪄</span>
                </button>
            )}
            
            {/* Consistency Check Status */}
            {face.imageUrl && face.type === 'story' && (
                <div className="absolute top-16 right-6 z-20 flex flex-col items-end gap-1">
                    {face.consistencyFlags && face.consistencyFlags.length > 0 ? (
                        <div className="bg-yellow-500/90 text-white text-[8px] font-bold px-2 py-1 rounded border border-white/20 shadow-lg flex items-center gap-1">
                            <span>⚠️ Consistency Corrected</span>
                        </div>
                    ) : (
                        <div className="bg-green-500/90 text-white text-[8px] font-bold px-2 py-1 rounded border border-white/20 shadow-lg flex items-center gap-1">
                            <span>✅ Visual Verified</span>
                        </div>
                    )}
                </div>
            )}

            {/* Portada - Botón de Apertura */}
            {face.type === 'cover' && (
                 <div className="absolute bottom-20 inset-x-0 flex justify-center z-20">
                     <button onClick={(e) => { e.stopPropagation(); onOpenBook(); }}
                      disabled={!allFaces.find(f => f.pageIndex === 1)?.imageUrl}
                      className="icpr-btn-primary bg-icpr-gold text-icpr-blue !px-12 !py-5 text-xl font-extrabold hover:scale-110 active:scale-95 animate-bounce disabled:animate-none disabled:bg-gray-400 disabled:opacity-50">
                         {(!allFaces.find(f => f.pageIndex === 1)?.imageUrl) ? `ENTINTANDO...` : 'COMENZAR LECTURA'}
                     </button>
                 </div>
            )}

            {/* Contraportada - Acciones Finales */}
            {face.type === 'back_cover' && (
                <div className="absolute bottom-24 inset-x-0 flex flex-col items-center gap-4 px-8 z-20">
                    <button onClick={(e) => { e.stopPropagation(); onDownload(); }} 
                        className="w-full bg-icpr-ruby text-white py-4 rounded-xl font-montserrat font-bold uppercase tracking-widest hover:brightness-110 shadow-2xl border border-white/20 transition-all">
                        Guardar Colección PDF
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onReset(); }} 
                        className="w-full bg-icpr-blue text-white py-4 rounded-xl font-montserrat font-bold uppercase tracking-widest hover:brightness-110 shadow-2xl border border-white/20 transition-all">
                        Escribir Nueva Saga
                    </button>
                </div>
            )}
            
            {/* Indicador de Página */}
            {face.pageIndex !== undefined && face.pageIndex > 0 && face.pageIndex < 11 && (
                <div className={`absolute top-6 ${face.pageIndex % 2 === 0 ? 'left-6' : 'right-6'} bg-icpr-blue/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[9px] font-bold border border-white/20 z-10 shadow-lg`}>
                    CAPÍTULO {face.pageIndex}
                </div>
            )}
        </div>
    );
}
