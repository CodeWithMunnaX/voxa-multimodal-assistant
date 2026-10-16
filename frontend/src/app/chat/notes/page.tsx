"use client"

import { useState } from "react"
import { StickyNote, Sparkles, FilePlus, Search, PenTool, Share2, AlignLeft, CheckSquare, List, Type, MoreVertical, BrainCircuit, Loader2, BookOpen, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"

export default function NotesPage() {
  const [activeNoteContent, setActiveNoteContent] = useState<string>("")
  const [subject, setSubject] = useState("Computer Science")
  const [topic, setTopic] = useState("")
  const [activeSubject, setActiveSubject] = useState("")
  const [activeTopic, setActiveTopic] = useState("")
  const [generatedTopicTitle, setGeneratedTopicTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false)
  
  const subjects = [
    "Computer Science", 
    "Mathematics", 
    "Physics",
    "Chemistry",
    "Biology",
    "History", 
    "Business & Economics", 
    "Literature", 
    "Marketing",
    "Psychology"
  ]

  const handleGenerateNote = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const res: any = await api.post("/notes/generate", { subject, topic });
      if (res.success) {
        setGeneratedTopicTitle(`${subject}: ${topic}`);
        setActiveSubject(subject);
        setActiveTopic(topic);
        setActiveNoteContent(res.content);
      } else {
        console.error("Error from API:", res.error);
      }
    } catch (error) {
      console.error("Failed to generate note", error);
    } finally {
      setIsGenerating(false);
      setTopic("");
    }
  }

  const handleGenerateMindMap = async () => {
    if (!activeSubject || !activeTopic) return;
    setIsGeneratingMindMap(true);
    try {
      const res: any = await api.post("/notes/generate-mindmap", { subject: activeSubject, topic: activeTopic });
      if (res.success) {
        setActiveNoteContent(prev => prev + "\n" + res.content);
      } else {
        console.error("Error from API:", res.error);
      }
    } catch (error) {
      console.error("Failed to generate mind map", error);
    } finally {
      setIsGeneratingMindMap(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-transparent text-foreground font-sans relative">

      <main className="flex-1 p-8 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  AI Notes
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Smart note-taking with real-time AI summarization and insights.</p>
              </div>
            </div>
          </div>

          {/* Two-pane Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
            
            {/* Left Sidebar: Subjects List */}
            <div className="lg:col-span-1 bg-card border border-border rounded-none overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-border bg-muted/50">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Subjects
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Select a subject to generate notes</p>
              </div>
              
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                  <Input 
                    placeholder="Search subjects..." 
                    className="w-full bg-white border-input text-foreground pl-9 h-9 text-sm focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {subjects.map((sub) => (
                  <div 
                    key={sub} 
                    onClick={() => setSubject(sub)}
                    className={`p-3.5 rounded-none cursor-pointer transition-all border flex items-center gap-3 ${
                      subject === sub 
                        ? 'bg-secondary border-primary/30 shadow-[0_4px_24px_-8px_rgba(124,92,255,0.15)]' 
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className={`p-2 rounded-none ${subject === sub ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className={`text-sm font-semibold ${subject === sub ? 'text-primary' : 'text-foreground'}`}>
                      {sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Area: AI Notes Generator & Editor */}
            <div className="lg:col-span-3 flex gap-6 min-h-0">
              
              {/* Note Editor */}
              <div className="flex-1 bg-card border border-border rounded-none overflow-hidden shadow-sm flex flex-col">
                
                {/* Topic Input Area */}
                <div className="p-5 border-b border-border bg-muted/50 flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 block">
                      Topic for <span className="text-primary">{subject}</span>
                    </label>
                    <Input 
                      placeholder={`E.g. Introduction to Quantum Mechanics, React Hooks, etc.`} 
                      className="w-full bg-white border-input text-foreground focus-visible:ring-primary/40 h-11 text-sm"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerateNote();
                      }}
                    />
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-11 px-6 font-semibold transition-all w-full sm:w-auto shrink-0"
                    onClick={handleGenerateNote}
                    disabled={isGenerating || !topic.trim()}
                  >
                    {isGenerating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isGenerating ? "Generating..." : "Generate Notes"}
                  </Button>
                </div>
                
                {/* Editor Body */}
                <div className="flex-1 p-8 overflow-y-auto">
                  {generatedTopicTitle && (
                    <h1 className="text-3xl font-bold text-foreground mb-6 outline-none" contentEditable suppressContentEditableWarning>
                      {generatedTopicTitle}
                    </h1>
                  )}
                  
                  {activeNoteContent ? (
                    <div 
                      className="text-foreground space-y-4 outline-none text-sm leading-relaxed prose max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-h2:text-foreground prose-h3:text-foreground prose-strong:text-primary prose-ul:list-disc prose-ol:list-decimal" 
                      contentEditable 
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: activeNoteContent }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                      <p className="text-lg font-medium text-foreground">No notes generated yet</p>
                      <p className="text-sm max-w-sm text-center">Select a subject on the left, enter a specific topic above, and let AI generate comprehensive notes for you.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insights Panel */}
              {activeNoteContent && (
                <div className="w-72 bg-gradient-to-b from-secondary to-card border border-primary/20 rounded-none p-5 flex flex-col shadow-[0_4px_24px_-8px_rgba(124,92,255,0.15)] transition-all">
                  <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Insights</h3>
                  </div>
                  
                  <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
                      <p className="text-xs text-foreground/90 leading-relaxed p-3 bg-card rounded-none border border-border">
                        These notes cover {generatedTopicTitle}. Review the key concepts and formulas to master this topic.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Study Tips</h4>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-start p-3 bg-card rounded-none border border-border">
                          <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground/90">Create flashcards for main terms</span>
                        </div>
                        <div className="flex gap-2 items-start p-3 bg-card rounded-none border border-border">
                          <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground/90">Practice with sample problems</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4 bg-secondary hover:bg-primary/15 text-primary border border-primary/30 rounded-none text-xs"
                    onClick={handleGenerateMindMap}
                    disabled={isGeneratingMindMap}
                  >
                    {isGeneratingMindMap ? (
                      <><Loader2 className="h-3 w-3 mr-2 animate-spin inline-block" /> Generating Map...</>
                    ) : "Generate Mind Map"}
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
