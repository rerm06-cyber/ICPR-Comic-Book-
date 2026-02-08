
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import jsPDF from 'jspdf';
import { BACK_COVER_PAGE, TOTAL_PAGES, INITIAL_PAGES, BATCH_SIZE, DECISION_PAGES, GENRES, ComicFace, Beat, Persona } from './types';
import { Setup } from './Setup';
import { Book } from './Book';
import { Gallery } from './Gallery';
import { EditModal } from './EditModal';

const MODEL_TEXT_NAME = "gemini-3-flash-preview"; // Switched to Flash for better quota handling
const MODEL_IMAGE_GEN_NAME = "gemini-2.5-flash-image"; 
const MODEL_VISION_CHECK = "gemini-3-flash-preview";
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export const PRESET_DESCRIPTIONS = {
    ivonne: "Ivonne: High-fidelity 3D Disney-Pixar style woman. Light blonde wavy hair, warm skin. Wearing a sleeveless blue floral patterned dress, a solid gold collar necklace, and light grey heels. Confident, smiling expression.",
    rene: "René: High-fidelity 3D Disney-Pixar style man. Bald, light honey-toned olive skin (trigueño claro color miel), perfectly groomed dark full beard. Wearing a white short-sleeved polo shirt with a small ICPR logo on the chest, and khaki-colored pants. Friendly and intelligent look."
};

const DEFAULT_STYLE = "Masterful fusion of real comic book art and high-fidelity 3D Disney-Pixar animation for adults. Ultra-sharp textures, cinematic rim lighting, bold comic-style shadows.";

const App: React.FC = () => {
  const [hero, setHeroState] = useState<Persona | null>(null);
  const [friend, setFriendState] = useState<Persona | null>(null);
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [customPremise, setCustomPremise] = useState("Hato Rey");
  const [userStory, setUserStory] = useState("");
  const [visualStyle, setVisualStyle] = useState(DEFAULT_STYLE);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingStyle, setIsEnhancingStyle] = useState(false);
  const [isExtractingStyle, setIsExtractingStyle] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [editingFace, setEditingFace] = useState<ComicFace | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const heroRef = useRef<Persona | null>(null);
  const friendRef = useRef<Persona | null>(null);

  useEffect(() => {
    const savedHero = localStorage.getItem('icpr_comic_hero');
    const savedFriend = localStorage.getItem('icpr_comic_friend');
    const savedGenre = localStorage.getItem('icpr_comic_genre');
    const savedPremise = localStorage.getItem('icpr_comic_premise');
    const savedStory = localStorage.getItem('icpr_comic_story');
    const savedStyle = localStorage.getItem('icpr_comic_style');

    if (savedHero) setHero(JSON.parse(savedHero));
    if (savedFriend) setFriend(JSON.parse(savedFriend));
    if (savedGenre) setSelectedGenre(savedGenre);
    if (savedPremise) setCustomPremise(savedPremise);
    if (savedStory) setUserStory(savedStory);
    if (savedStyle) setVisualStyle(savedStyle);
  }, []);

  const setHero = (p: Persona | null) => { 
    setHeroState(p); 
    heroRef.current = p;
    if (p) localStorage.setItem('icpr_comic_hero', JSON.stringify(p));
    else localStorage.removeItem('icpr_comic_hero');
  };
  
  const setFriend = (p: Persona | null) => { 
    setFriendState(p); 
    friendRef.current = p;
    if (p) localStorage.setItem('icpr_comic_friend', JSON.stringify(p));
    else localStorage.removeItem('icpr_comic_friend');
  };

  const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

  const callGeminiWithRetry = async (fn: () => Promise<any>, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<any> => {
    try {
      return await fn();
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      if (retries > 0 && isQuotaError) {
        console.warn(`Quota exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiWithRetry(fn, retries - 1, delay * 2);
      }
      if (isQuotaError) {
        setGlobalError("Se ha agotado la cuota de la IA. Por favor, espera un momento antes de intentarlo de nuevo.");
      } else {
        setGlobalError("Hubo un error al conectar con la IA. Por favor, verifica tu conexión.");
      }
      throw error;
    }
  };

  const handleEnhanceStory = async () => {
    if (!userStory.trim()) return;
    setIsEnhancing(true);
    setGlobalError(null);
    const ai = getAI();
    const prompt = `Como guionista experto, mejora esta idea para un cómic del 80 Aniversario Rubí de ICPR Junior College.
    Idea base: ${userStory}
    Contexto: Campus ${customPremise}, Especialidad ${selectedGenre}.
    Protagonistas: René (Líder visionario calvo, trigueño claro color miel, con barba) e Ivonne (Líder estratégica rubia con vestido azul).
    
    Transforma la idea en una narrativa épica de 10 capítulos (más portada y contraportada) que destaque la excelencia educativa. 
    Responde con la historia mejorada en un párrafo fluido.`;

    try {
      const res = await callGeminiWithRetry(() => ai.models.generateContent({
        model: MODEL_TEXT_NAME,
        contents: prompt
      }));
      const enhanced = res.text?.trim() || userStory;
      setUserStory(enhanced);
      localStorage.setItem('icpr_comic_story', enhanced);
    } catch (e) {
      console.error("Enhance failed", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleEnhanceStyle = async () => {
    if (!visualStyle.trim()) return;
    setIsEnhancingStyle(true);
    setGlobalError(null);
    const ai = getAI();
    const prompt = `Enhance the following visual style description for an AI image generator. 
    The goal is a 'Disney Pixar style for adults' and 'high-fidelity 3D' comic book fusion. 
    Make it technical, cinematic, and highly descriptive.
    Original Style: ${visualStyle}`;

    try {
      const res = await callGeminiWithRetry(() => ai.models.generateContent({
        model: MODEL_TEXT_NAME,
        contents: prompt
      }));
      const enhanced = res.text?.trim() || visualStyle;
      setVisualStyle(enhanced);
      localStorage.setItem('icpr_comic_style', enhanced);
    } catch (e) {
      console.error("Style enhancement failed", e);
    } finally {
      setIsEnhancingStyle(false);
    }
  };

  const handleExtractStyle = async (file: File) => {
    setIsExtractingStyle(true);
    setGlobalError(null);
    try {
      const base64 = await fileToBase64(file);
      const ai = getAI();
      const prompt = `Analyze the visual style of this image. Describe its artistic style, color palette, lighting, and textures in a concise paragraph that can be used as a prompt for an AI image generator. Focus ONLY on the art style (brushstrokes, 3D renders, comic lines, etc.), not the content of the image. Aim for a description that fits a 'high-fidelity 3D Disney-Pixar for adults' aesthetic.`;
      
      const res = await callGeminiWithRetry(() => ai.models.generateContent({
        model: MODEL_VISION_CHECK,
        contents: [{ parts: [{ inlineData: { mimeType: 'image/png', data: base64 } }, { text: prompt }]}]
      }));
      
      const extracted = res.text?.trim() || visualStyle;
      setVisualStyle(extracted);
      localStorage.setItem('icpr_comic_style', extracted);
    } catch (e) {
      console.error("Style extraction failed", e);
    } finally {
      setIsExtractingStyle(false);
    }
  };

  const [comicFaces, setComicFaces] = useState<ComicFace[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const generatingPages = useRef(new Set<number>());
  const historyRef = useRef<ComicFace[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const checkVisualConsistency = async (imageDataBase64: string, character: Persona): Promise<{ passed: boolean, feedback: string[] }> => {
    const ai = getAI();
    const prompt = `Verify character consistency for ${character.desc.split(':')[0]}. Does it match the description perfectly? (René must be bald with light honey-toned olive skin and a beard). Reply PASS or list errors.`;
    try {
      const res = await callGeminiWithRetry(() => ai.models.generateContent({
        model: MODEL_VISION_CHECK,
        contents: [{ parts: [{ inlineData: { mimeType: 'image/png', data: imageDataBase64 } }, { text: prompt }]}]
      }));
      const text = res.text?.trim() || "PASS";
      if (text.toUpperCase().includes("PASS")) return { passed: true, feedback: [] };
      return { passed: false, feedback: text.split('\n').filter(l => l.length > 5) };
    } catch (e) { return { passed: true, feedback: [] }; }
  };

  const generateBeat = async (history: ComicFace[], pageNum: number, isDecisionPage: boolean): Promise<Beat> => {
    if (!heroRef.current) throw new Error("Hero reference missing");
    const systemInstruction = `Eres un guionista de cómics de ÉLITE. Historia de 10 páginas para el 80 Aniversario de ICPR.
    ESTILO: ${visualStyle}.
    PERSONAJES: René (calvo, trigueño claro color miel, barba, polo blanco ICPR) e Ivonne (rubia, vestido azul floreado).`;

    const prompt = `Escribe la página ${pageNum}/10 de: ${userStory}. Campus: ${customPremise}. 
    Responde en JSON: { "caption": "...", "dialogue": "...", "scene": "...", "focus_char": "hero", "choices": [] }`;

    const ai = getAI();
    const res = await callGeminiWithRetry(() => ai.models.generateContent({ 
      model: MODEL_TEXT_NAME, 
      contents: prompt, 
      config: { systemInstruction, responseMimeType: 'application/json' } 
    }));
    let text = res.text.trim();
    if (text.startsWith('```')) text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(text) as Beat;
  };

  const generateImage = async (beat: Beat, pageType: string, retryCount = 0, consistencyFeedback?: string[]): Promise<string> => {
    const parts: any[] = [];
    if (heroRef.current?.base64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: heroRef.current.base64 } });
    const promptText = `
      STYLE: ${visualStyle}. 
      RENE: Bald, light honey-toned olive skin (trigueño claro miel), beard, white ICPR polo, khaki pants. 
      IVONNE: Blonde wavy hair, blue floral sleeveless dress, gold collar necklace.
      SCENE: ${beat.scene}. ${consistencyFeedback ? `CORRECT: ${consistencyFeedback.join(',')}` : ''}
    `;
    parts.push({ text: promptText });

    const ai = getAI();
    const res = await callGeminiWithRetry(() => ai.models.generateContent({
      model: MODEL_IMAGE_GEN_NAME,
      contents: { parts },
      config: { imageConfig: { aspectRatio: '2:3' } }
    }));
    const imgPart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imgPart?.inlineData?.data) throw new Error("Image error");
    return `data:image/png;base64,${imgPart.inlineData.data}`;
  };

  const updateFaceState = useCallback((id: string, updates: Partial<ComicFace>) => {
      setComicFaces(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
      const idx = historyRef.current.findIndex(f => f.id === id);
      if (idx !== -1) historyRef.current[idx] = { ...historyRef.current[idx], ...updates };
  }, []);

  const handleEditImage = async (instruction: string, refImageBase64?: string) => {
    if (!editingFace || !editingFace.imageUrl) return;
    
    const faceId = editingFace.id;
    updateFaceState(faceId, { isLoading: true });
    setGlobalError(null);
    
    const currentImgBase64 = editingFace.imageUrl.split(',')[1];
    const parts: any[] = [
      { inlineData: { mimeType: 'image/png', data: currentImgBase64 } },
      { text: `EDIT INSTRUCTION: ${instruction}. STYLE: ${visualStyle}. Maintain character consistency: René (bald, light honey-toned honey skin, beard, white polo) and Ivonne (blonde, blue dress).` }
    ];

    if (refImageBase64) {
      parts.push({ inlineData: { mimeType: 'image/png', data: refImageBase64 } });
      parts[parts.length-2].text += " Use the provided reference image to guide the visual change.";
    }

    try {
      const ai = getAI();
      const res = await callGeminiWithRetry(() => ai.models.generateContent({
        model: MODEL_IMAGE_GEN_NAME,
        contents: { parts },
        config: { imageConfig: { aspectRatio: '2:3' } }
      }));
      const imgPart = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imgPart?.inlineData?.data) {
        updateFaceState(faceId, { imageUrl: `data:image/png;base64,${imgPart.inlineData.data}`, isLoading: false });
      }
    } catch (e) {
      console.error("Edit failed", e);
      updateFaceState(faceId, { isLoading: false });
    }
    setEditingFace(null);
  };

  const generateSinglePage = async (faceId: string, pageNum: number, type: ComicFace['type']) => {
      if (generatingPages.current.has(pageNum)) return;
      generatingPages.current.add(pageNum);
      const isDecision = DECISION_PAGES.includes(pageNum);
      try {
          let beat: Beat = { scene: "ICPR, 3D Pixar style", choices: [], focus_char: 'hero' };
          if (type !== 'cover') beat = await generateBeat(historyRef.current, pageNum, isDecision);
          updateFaceState(faceId, { narrative: beat, choices: beat.choices, isDecisionPage: isDecision });
          let url = await generateImage(beat, type);
          updateFaceState(faceId, { imageUrl: url, originalImageUrl: url, isLoading: false });
      } catch (e) {
          updateFaceState(faceId, { isLoading: false });
      } finally {
          generatingPages.current.delete(pageNum);
      }
  };

  const generateAllPages = async () => {
      await generateSinglePage('cover', 0, 'cover');
      for (let i = 1; i <= TOTAL_PAGES; i++) {
          const type = i === BACK_COVER_PAGE ? 'back_cover' : 'story';
          await generateSinglePage(i === BACK_COVER_PAGE ? 'page-11' : `page-${i}`, i, type);
      }
  };

  const handleChoice = (pageIndex: number, choice: string) => {
    const face = comicFaces.find(f => f.pageIndex === pageIndex);
    if (face) {
      updateFaceState(face.id, { resolvedChoice: choice });
    }
  };

  const downloadPDF = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [800, 1200]
    });

    for (let i = 0; i < comicFaces.length; i++) {
      const face = comicFaces[i];
      if (face.imageUrl) {
        if (i > 0) doc.addPage([800, 1200], 'portrait');
        doc.addImage(face.imageUrl, 'PNG', 0, 0, 800, 1200);
      }
    }
    doc.save('ICPR_Comic_80th_Anniversary.pdf');
  };

  const resetApp = () => {
    setHero(null);
    setFriend(null);
    setSelectedGenre(GENRES[0]);
    setCustomPremise("Hato Rey");
    setUserStory("");
    setVisualStyle(DEFAULT_STYLE);
    setComicFaces([]);
    setCurrentSheetIndex(0);
    setIsStarted(false);
    setShowSetup(true);
    historyRef.current = [];
    setGlobalError(null);
    localStorage.clear();
  };

  return (
    <div className="comic-scene">
      {/* Global Error Banner */}
      {globalError && (
        <div className="fixed top-0 left-0 right-0 z-[500] bg-icpr-ruby text-white p-4 text-center font-montserrat font-bold text-sm animate-in slide-in-from-top duration-300 flex justify-center items-center gap-4">
          <span>⚠️ {globalError}</span>
          <button onClick={() => setGlobalError(null)} className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded-lg text-xs">Cerrar</button>
        </div>
      )}

      <Setup 
          show={showSetup}
          isTransitioning={isTransitioning}
          hero={hero}
          friend={friend}
          selectedGenre={selectedGenre}
          selectedLanguage={"es-PR"}
          customPremise={customPremise}
          userStory={userStory}
          visualStyle={visualStyle}
          isEnhancing={isEnhancing}
          isEnhancingStyle={isEnhancingStyle}
          isExtractingStyle={isExtractingStyle}
          onHeroUpload={async (f) => { const b = await fileToBase64(f); setHero({ id: 'hero', base64: b, desc: "Lead" }); }}
          onFriendUpload={async (f) => { const b = await fileToBase64(f); setFriend({ id: 'friend', base64: b, desc: "Partner" }); }}
          onGenreChange={(v) => { setSelectedGenre(v); localStorage.setItem('icpr_comic_genre', v); }}
          onPremiseChange={(v) => { setCustomPremise(v); localStorage.setItem('icpr_comic_premise', v); }}
          onStoryChange={(v) => { setUserStory(v); localStorage.setItem('icpr_comic_story', v); }}
          onStyleChange={(v) => { setVisualStyle(v); localStorage.setItem('icpr_comic_style', v); }}
          onEnhanceStory={handleEnhanceStory}
          onEnhanceStyle={handleEnhanceStyle}
          onExtractStyle={handleExtractStyle}
          onLaunch={async () => {
            setGlobalError(null);
            setIsTransitioning(true);
            const skeleton: ComicFace[] = Array.from({ length: 12 }, (_, i) => ({
              id: i === 11 ? 'page-11' : (i === 0 ? 'cover' : `page-${i}`),
              type: i === 0 ? 'cover' : (i === 11 ? 'back_cover' : 'story'),
              choices: [], isLoading: true, pageIndex: i
            }));
            setComicFaces(skeleton);
            historyRef.current = skeleton;
            setIsStarted(true);
            setShowSetup(false);
            setIsTransitioning(false);
            generateAllPages();
          }}
          onSetHero={setHero}
          onSetFriend={setFriend}
      />
      <Book 
          comicFaces={comicFaces}
          currentSheetIndex={currentSheetIndex}
          isStarted={isStarted}
          isSetupVisible={showSetup && !isTransitioning}
          onSheetClick={(i) => setCurrentSheetIndex(i)}
          onChoice={handleChoice}
          onOpenBook={() => setCurrentSheetIndex(1)}
          onDownload={downloadPDF}
          onReset={resetApp}
          onEditPage={(face) => setEditingFace(face)}
      />
      <Gallery 
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        comicFaces={comicFaces}
        hero={hero}
        friend={friend}
        onJumpToPage={(idx) => { setCurrentSheetIndex(Math.ceil(idx / 2)); setShowGallery(false); }}
      />
      <EditModal 
        face={editingFace}
        onClose={() => setEditingFace(null)}
        onSave={handleEditImage}
      />
      {isStarted && (
        <button 
          onClick={() => setShowGallery(true)}
          className="fixed bottom-24 right-8 z-[150] bg-icpr-blue text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-icpr-green flex items-center gap-2 font-montserrat font-bold text-xs uppercase tracking-widest"
        >
          <span>📚</span> Ver Archivo
        </button>
      )}
    </div>
  );
};

export default App;
