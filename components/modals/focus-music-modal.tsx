"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Headphones, Play, Pause, Volume2, SkipForward, SkipBack } from "lucide-react"

interface FocusMusicModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FocusMusicModal({ open, onOpenChange }: FocusMusicModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState([75])
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<any | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const musicTracks = [
    {
      id: 1,
      title: "Forest Rain",
      category: "Nature Sounds",
      duration: "60:00",
      description: "Gentle rain sounds with forest ambiance",
      color: "bg-green-500",
      soundConfig: {
        type: "rain",
        baseFreq: 200,
        filterFreq: 800,
        noiseType: "brown",
      },
    },
    {
      id: 2,
      title: "Ocean Waves",
      category: "Nature Sounds",
      duration: "45:00",
      description: "Calming ocean waves for deep focus",
      color: "bg-blue-500",
      soundConfig: {
        type: "waves",
        baseFreq: 100,
        filterFreq: 400,
        modulation: 0.3,
      },
    },
    {
      id: 3,
      title: "Lo-Fi Study Beats",
      category: "Instrumental",
      duration: "120:00",
      description: "Chill lo-fi hip hop for studying",
      color: "bg-purple-500",
      soundConfig: {
        type: "lofi",
        baseFreq: 220,
        chords: [220, 277, 330, 392],
        rhythm: true,
      },
    },
    {
      id: 4,
      title: "Classical Focus",
      category: "Classical",
      duration: "90:00",
      description: "Bach and Mozart for concentration",
      color: "bg-orange-500",
      soundConfig: {
        type: "classical",
        baseFreq: 440,
        harmonics: [440, 554, 659, 880],
        arpeggio: true,
      },
    },
    {
      id: 5,
      title: "White Noise",
      category: "Ambient",
      duration: "∞",
      description: "Pure white noise for blocking distractions",
      color: "bg-gray-500",
      soundConfig: {
        type: "whitenoise",
        filterFreq: 2000,
        noiseType: "white",
      },
    },
    {
      id: 6,
      title: "Cafe Ambiance",
      category: "Ambient",
      duration: "75:00",
      description: "Coffee shop atmosphere with gentle chatter",
      color: "bg-amber-500",
      soundConfig: {
        type: "cafe",
        baseFreq: 300,
        filterFreq: 1200,
        chatter: true,
      },
    },
  ]

  const categories = ["All", "Nature Sounds", "Instrumental", "Classical", "Ambient"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTracks =
    selectedCategory === "All" ? musicTracks : musicTracks.filter((track) => track.category === selectedCategory)

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (oscillatorRef.current) {
        stopAudio()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const createEnhancedSound = (config: any) => {
    if (!audioContextRef.current) return null

    const ctx = audioContextRef.current
    const masterGain = ctx.createGain()
    masterGain.connect(ctx.destination)

    switch (config.type) {
      case "rain":
        // Brown noise filtered for rain effect
        const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
        const rainData = rainBuffer.getChannelData(0)
        let lastOut = 0
        for (let i = 0; i < rainData.length; i++) {
          const white = Math.random() * 2 - 1
          rainData[i] = lastOut = (lastOut + 0.02 * white) / 1.02
        }
        const rainSource = ctx.createBufferSource()
        rainSource.buffer = rainBuffer
        rainSource.loop = true

        const rainFilter = ctx.createBiquadFilter()
        rainFilter.type = "lowpass"
        rainFilter.frequency.value = config.filterFreq

        rainSource.connect(rainFilter)
        rainFilter.connect(masterGain)
        return { source: rainSource, gain: masterGain }

      case "waves":
        // Oscillating low frequency for wave sounds
        const waveOsc = ctx.createOscillator()
        waveOsc.type = "sine"
        waveOsc.frequency.value = config.baseFreq

        const waveLFO = ctx.createOscillator()
        waveLFO.type = "sine"
        waveLFO.frequency.value = 0.1

        const lfoGain = ctx.createGain()
        lfoGain.gain.value = config.modulation * config.baseFreq

        waveLFO.connect(lfoGain)
        lfoGain.connect(waveOsc.frequency)

        const waveFilter = ctx.createBiquadFilter()
        waveFilter.type = "lowpass"
        waveFilter.frequency.value = config.filterFreq

        waveOsc.connect(waveFilter)
        waveFilter.connect(masterGain)

        return { source: waveOsc, lfo: waveLFO, gain: masterGain }

      case "lofi":
        // Simple chord progression for lo-fi
        const lofiOscs = config.chords.map((freq: number) => {
          const osc = ctx.createOscillator()
          osc.type = "triangle"
          osc.frequency.value = freq
          return osc
        })

        lofiOscs.forEach((osc: OscillatorNode) => {
          const oscGain = ctx.createGain()
          oscGain.gain.value = 0.1
          osc.connect(oscGain)
          oscGain.connect(masterGain)
        })

        return { sources: lofiOscs, gain: masterGain }

      case "classical":
        // Arpeggio pattern for classical feel
        const classicalOscs = config.harmonics.map((freq: number) => {
          const osc = ctx.createOscillator()
          osc.type = "sine"
          osc.frequency.value = freq
          return osc
        })

        classicalOscs.forEach((osc: OscillatorNode, index: number) => {
          const oscGain = ctx.createGain()
          oscGain.gain.value = 0.05 * (1 - index * 0.1)
          osc.connect(oscGain)
          oscGain.connect(masterGain)
        })

        return { sources: classicalOscs, gain: masterGain }

      case "whitenoise":
        // Pure white noise
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
        const noiseData = noiseBuffer.getChannelData(0)
        for (let i = 0; i < noiseData.length; i++) {
          noiseData[i] = Math.random() * 2 - 1
        }
        const noiseSource = ctx.createBufferSource()
        noiseSource.buffer = noiseBuffer
        noiseSource.loop = true
        noiseSource.connect(masterGain)

        return { source: noiseSource, gain: masterGain }

      case "cafe":
        // Filtered noise with periodic variations for cafe ambiance
        const cafeBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
        const cafeData = cafeBuffer.getChannelData(0)
        for (let i = 0; i < cafeData.length; i++) {
          cafeData[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i / 1000))
        }
        const cafeSource = ctx.createBufferSource()
        cafeSource.buffer = cafeBuffer
        cafeSource.loop = true

        const cafeFilter = ctx.createBiquadFilter()
        cafeFilter.type = "bandpass"
        cafeFilter.frequency.value = config.filterFreq
        cafeFilter.Q.value = 2

        cafeSource.connect(cafeFilter)
        cafeFilter.connect(masterGain)

        return { source: cafeSource, gain: masterGain }

      default:
        return null
    }
  }

  const playAudio = () => {
    if (!audioContextRef.current) return

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume()
    }

    const currentTrackData = filteredTracks[currentTrack]
    if (!currentTrackData) return

    const soundSystem = createEnhancedSound(currentTrackData.soundConfig)
    if (!soundSystem) return

    // Store reference for cleanup
    oscillatorRef.current = soundSystem
    gainNodeRef.current = soundSystem.gain

    // Set initial volume
    soundSystem.gain.gain.setValueAtTime(volume[0] / 100, audioContextRef.current.currentTime)

    // Start all sound sources
    if (soundSystem.source) {
      soundSystem.source.start()
    }
    if (soundSystem.sources) {
      soundSystem.sources.forEach((source: OscillatorNode) => source.start())
    }
    if (soundSystem.lfo) {
      soundSystem.lfo.start()
    }
  }

  const stopAudio = () => {
    if (oscillatorRef.current) {
      if (oscillatorRef.current.source) {
        oscillatorRef.current.source.stop()
      }
      if (oscillatorRef.current.sources) {
        oscillatorRef.current.sources.forEach((source: OscillatorNode) => source.stop())
      }
      if (oscillatorRef.current.lfo) {
        oscillatorRef.current.lfo.stop()
      }
      oscillatorRef.current.gain.disconnect()
      oscillatorRef.current = null
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio()
    } else {
      playAudio()
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (isPlaying) {
      stopAudio()
    }
    setCurrentTrack((prev) => (prev + 1) % filteredTracks.length)
    if (isPlaying) {
      setTimeout(playAudio, 100)
    }
  }

  const prevTrack = () => {
    if (isPlaying) {
      stopAudio()
    }
    setCurrentTrack((prev) => (prev - 1 + filteredTracks.length) % filteredTracks.length)
    if (isPlaying) {
      setTimeout(playAudio, 100)
    }
  }

  const selectTrack = (index: number) => {
    if (isPlaying) {
      stopAudio()
    }
    setCurrentTrack(index)
    setIsPlaying(true)
    setTimeout(playAudio, 100)
  }

  // Update volume in real-time
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume[0] / 100, audioContextRef.current.currentTime)
    }
  }, [volume])

  // Stop audio when modal closes
  useEffect(() => {
    if (!open && isPlaying) {
      stopAudio()
      setIsPlaying(false)
    }
  }, [open, isPlaying])

  const currentPlayingTrack = filteredTracks[currentTrack] || musicTracks[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <Headphones className="h-6 w-6" />
            </div>
            Focus Music
            <span className="text-xl ml-auto">🎵</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-2">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div
                  className={`w-24 h-24 mx-auto rounded-full ${currentPlayingTrack.color} flex items-center justify-center shadow-lg ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                >
                  <Headphones className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentPlayingTrack.title}</h3>
                  <p className="text-gray-700">{currentPlayingTrack.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{currentPlayingTrack.description}</p>
                  {isPlaying && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🎵 Now Playing
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm" onClick={prevTrack} className="border-gray-300 text-gray-700">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-full w-16 h-16 text-white"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextTrack} className="border-gray-300 text-gray-700">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <Volume2 className="h-4 w-4 text-gray-600" />
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                  <span className="text-sm text-gray-600 w-8">{volume[0]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs ${
                  selectedCategory === category
                    ? "bg-teal-500 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md bg-white border ${
                    currentTrack === index ? "ring-2 ring-teal-500 border-teal-200" : "border-gray-200"
                  }`}
                  onClick={() => selectTrack(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${track.color} flex items-center justify-center relative`}>
                        {currentTrack === index && isPlaying ? (
                          <>
                            <Pause className="h-5 w-5 text-white" />
                            <div className="absolute inset-0 rounded-lg bg-white/20 animate-pulse"></div>
                          </>
                        ) : (
                          <Play className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{track.title}</h4>
                        <p className="text-sm text-gray-600">{track.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium">{track.duration}</p>
                        {currentTrack === index && isPlaying && (
                          <p className="text-xs text-green-600 font-medium">Playing</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
