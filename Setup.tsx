
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { GENRES, Persona } from './types';
import { PRESET_DESCRIPTIONS } from './App';

interface SetupProps {
    show: boolean;
    isTransitioning: boolean;
    hero: Persona | null;
    friend: Persona | null;
    selectedGenre: string;
    selectedLanguage: string;
    customPremise: string;
    userStory: string;
    visualStyle: string;
    isEnhancing: boolean;
    isEnhancingStyle: boolean;
    isExtractingStyle: boolean;
    onHeroUpload: (file: File) => void;
    onFriendUpload: (file: File) => void;
    onGenreChange: (val: string) => void;
    onPremiseChange: (val: string) => void;
    onStoryChange: (val: string) => void;
    onStyleChange: (val: string) => void;
    onEnhanceStory: () => void;
    onEnhanceStyle: () => void;
    onExtractStyle: (file: File) => void;
    onLaunch: () => void;
    onSetHero: (p: Persona | null) => void;
    onSetFriend: (p: Persona | null) => void;
}

const Logo80Ruby = () => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="text-7xl md:text-9xl font-montserrat font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-icpr-ruby via-[#ff4d4d] to-icpr-ruby drop-shadow-[0_5px_15px_rgba(220,38,38,0.4)] tracking-tighter">
        80
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-icpr-blue text-white px-4 py-1 rounded-full text-[10px] font-montserrat uppercase tracking-[0.2em] shadow-lg border-2 border-white">
        Años de Éxito
      </div>
    </div>
  </div>
);

const HarleyMascot3D = () => (
  <div className="w-28 h-28 md:w-36 md:h-36 relative group">
    <div className="absolute inset-0 bg-white rounded-3xl border-4 border-icpr-blue shadow-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
        <div className="flex flex-col items-center relative">
            <span className="text-7xl z-10">🐘</span>
            <div className="flex flex-col items-center -mt-2">
                <div className="w-10 h-14 bg-icpr-blue rounded-t-xl flex flex-col items-center pt-2">
                    <div className="w-1.5 h-6 bg-icpr-green rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
    <div className="absolute -top-3 -right-3 bg-icpr-green text-white text-[10px] font-bold px-3 py-1 rounded-lg border-2 border-white shadow-xl rotate-12">HARLEY</div>
  </div>
);

export const Setup: React.FC<SetupProps> = (props) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const loadIvonne = useCallback(() => props.onSetHero({ 
        id: 'ivonne',
        base64: '', 
        desc: PRESET_DESCRIPTIONS.ivonne
    }), [props]);
    
    const loadRene = useCallback(() => props.onSetFriend({ 
        id: 'rene',
        base64: '', 
        desc: PRESET_DESCRIPTIONS.rene
    }), [props]);

    if (!props.show && !props.isTransitioning) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-[#f9fafb] transition-opacity duration-700 ${props.isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <nav className={`fixed top-0 left-0 right-0 z-[210] px-6 py-4 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-white shadow-xl' : 'bg-transparent'}`}>
                <div className="flex items-center gap-3">
                    <div className="bg-icpr-blue text-white p-2 rounded-lg font-montserrat font-extrabold text-sm px-4 border-2 border-icpr-green">ICPR</div>
                    <span className="font-montserrat text-icpr-blue text-xs font-bold tracking-widest uppercase">Junior College</span>
                </div>
                <div className="font-playfair text-xl italic text-icpr-green font-bold">80 Años Juntos Trabajando tu Éxito</div>
            </nav>

            <div className="pt-24 pb-40 px-6 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-hide">
                <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="flex flex-wrap justify-center gap-12 items-center mb-8">
                        <HarleyMascot3D />
                        <Logo80Ruby />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-montserrat font-extrabold text-icpr-blue mb-4 tracking-tight leading-none uppercase">¡EL ÉXITO SE TRABAJA!</h1>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Character Column */}
                    <div className="flex flex-col gap-8">
                      <div className="icpr-card relative border-t-8 border-icpr-magenta flex flex-col">
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-icpr-magenta text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Protagonista</div>
                          <div className="w-full mb-6">
                              {(props.hero) ? (
                                  <div className="relative group overflow-hidden rounded-2xl border-4 border-icpr-blue aspect-square shadow-2xl bg-icpr-blue/5">
                                      {props.hero.base64 ? <img src={`data:image/jpeg;base64,${props.hero.base64}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-icpr-blue text-center p-6 text-sm">🌟 {props.hero.desc.split(':')[0]}</div>}
                                      <div className="absolute inset-0 bg-icpr-blue/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"><button onClick={() => props.onSetHero(null)} className="bg-white text-icpr-blue px-6 py-2 rounded-full font-bold text-xs uppercase">Cambiar</button></div>
                                  </div>
                              ) : (
                                  <label className="w-full aspect-square flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-2xl bg-white hover:border-icpr-magenta transition-all cursor-pointer p-8 group">
                                      <div className="text-6xl mb-4 group-hover:scale-110 duration-500 opacity-60">📸</div>
                                      <p className="font-montserrat text-[10px] text-gray-400 uppercase font-bold text-center">Sube tu foto</p>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onHeroUpload(e.target.files[0])} />
                                  </label>
                              )}
                          </div>
                          <button onClick={loadIvonne} className="mt-auto w-full bg-icpr-magenta text-white py-4 rounded-xl font-montserrat font-extrabold text-xs uppercase shadow-lg hover:brightness-110">Usar a Ivonne</button>
                      </div>

                      <div className="icpr-card relative border-t-8 border-icpr-green flex flex-col">
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-icpr-green text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Socio Estratégico</div>
                          <div className="w-full mb-6">
                              {(props.friend) ? (
                                  <div className="relative group overflow-hidden rounded-2xl border-4 border-icpr-blue aspect-square shadow-2xl bg-icpr-green/5">
                                      {props.friend.base64 ? <img src={`data:image/jpeg;base64,${props.friend.base64}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-icpr-blue text-center p-6 text-sm">🚀 {props.friend.desc.split(':')[0]}</div>}
                                      <div className="absolute inset-0 bg-icpr-blue/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"><button onClick={() => props.onSetFriend(null)} className="bg-white text-icpr-blue px-6 py-2 rounded-full font-bold text-xs uppercase">Cambiar</button></div>
                                  </div>
                              ) : (
                                  <label className="w-full aspect-square flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-2xl bg-white hover:border-icpr-green transition-all cursor-pointer p-8 group">
                                      <div className="text-6xl mb-4 group-hover:scale-110 duration-500 opacity-60">🤳</div>
                                      <p className="font-montserrat text-[10px] text-gray-400 uppercase font-bold text-center">Socio Estratégico</p>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onFriendUpload(e.target.files[0])} />
                                  </label>
                              )}
                          </div>
                          <button onClick={loadRene} className="mt-auto w-full bg-icpr-blue text-white py-4 rounded-xl font-montserrat font-extrabold text-xs uppercase shadow-lg hover:brightness-110">Usar a René</button>
                      </div>
                    </div>

                    {/* Story Mission */}
                    <div className="icpr-card border-t-8 border-icpr-gold flex flex-col h-full">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-icpr-gold text-icpr-blue px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Misión 80 Aniversario</div>
                        <div className="space-y-4 mb-4 flex-grow">
                            <div>
                                <label className="block text-[10px] font-montserrat font-extrabold text-icpr-blue uppercase mb-1 tracking-widest opacity-70">Sede y Especialidad</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select value={props.customPremise} className="p-2 bg-gray-50 border rounded-lg font-bold text-[10px]" onChange={(e) => props.onPremiseChange(e.target.value)}>
                                        <option value="Hato Rey">Hato Rey</option>
                                        <option value="Bayamón">Bayamón</option>
                                        <option value="Arecibo">Arecibo</option>
                                        <option value="Mayagüez">Mayagüez</option>
                                        <option value="Manatí">Manatí</option>
                                    </select>
                                    <select value={props.selectedGenre} className="p-2 bg-gray-50 border rounded-lg font-bold text-[10px]" onChange={(e) => props.onGenreChange(e.target.value)}>
                                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-montserrat font-extrabold text-icpr-blue uppercase mb-1 tracking-widest opacity-70">Guion Maestro (Tu Idea)</label>
                                <textarea 
                                    value={props.userStory}
                                    onChange={(e) => props.onStoryChange(e.target.value)}
                                    placeholder="Ej: René e Ivonne fundan un laboratorio de forense de alta tecnología..."
                                    className="w-full h-48 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-opensans text-xs text-gray-700 outline-none focus:border-icpr-gold transition-all resize-none"
                                />
                                <button 
                                    onClick={props.onEnhanceStory}
                                    disabled={props.isEnhancing || !props.userStory}
                                    className="absolute bottom-4 right-4 bg-icpr-ruby text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                >
                                    {props.isEnhancing ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '✨ Auto-Enhancer'}
                                </button>
                            </div>
                        </div>
                        <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest italic leading-tight">Narrativa Refinada por AI para 12 Páginas de Gloria</p>
                    </div>

                    {/* Visual Style Section */}
                    <div className="icpr-card border-t-8 border-icpr-blue flex flex-col h-full">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-icpr-blue text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Estilo Visual Personalizado</div>
                        <div className="space-y-4 mb-4 flex-grow">
                            <p className="text-xs text-gray-500 font-opensans">Define el arte de tu saga. Recomendamos fusionar 'Disney Pixar for adults' con 'high-fidelity 3D' para máxima elegancia.</p>
                            <div className="relative group">
                                <label className="block text-[10px] font-montserrat font-extrabold text-icpr-blue uppercase mb-1 tracking-widest opacity-70">Descripción del Estilo</label>
                                <textarea 
                                    value={props.visualStyle}
                                    onChange={(e) => props.onStyleChange(e.target.value)}
                                    placeholder="Ej: Disney Pixar style for adults, high-fidelity 3D, warm sunset lighting..."
                                    className="w-full h-48 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-opensans text-xs text-gray-700 outline-none focus:border-icpr-blue transition-all resize-none"
                                />
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                  <label className="bg-icpr-green text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2">
                                      {props.isExtractingStyle ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '🖼️ Extraer Estilo'}
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && props.onExtractStyle(e.target.files[0])} />
                                  </label>
                                  <button 
                                      onClick={props.onEnhanceStyle}
                                      disabled={props.isEnhancingStyle || !props.visualStyle}
                                      className="bg-icpr-ruby text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                  >
                                      {props.isEnhancingStyle ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : '✨ Style Enhancer'}
                                  </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-icpr-blue/20">
                          <p className="text-[9px] font-bold text-icpr-blue uppercase tracking-widest">💡 Tip de Arte</p>
                          <p className="text-[9px] text-gray-600 mt-1">Sube una imagen de referencia para que la IA aprenda su paleta de colores y técnica artística.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pb-24">
                    <button onClick={props.onLaunch} disabled={!props.hero || props.isTransitioning} className="icpr-btn-primary !text-2xl w-full max-w-lg uppercase tracking-[0.3em] font-extrabold shadow-2xl">
                        {props.isTransitioning ? 'Entintando Saga...' : '¡GENERAR CÓMIC ANIVERSARIO!'}
                    </button>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-icpr-blue text-white p-4 text-center text-[10px] font-montserrat font-bold tracking-[0.4em] uppercase z-[220] border-t-4 border-icpr-green">
                ICPR JUNIOR COLLEGE • TRABAJANDO TU ÉXITO DESDE 1946
            </div>
        </div>
    );
}
