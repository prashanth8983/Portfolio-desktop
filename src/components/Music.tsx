import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedoAlt,
  FaVolumeUp,
  FaVolumeMute,
  FaMusic
} from 'react-icons/fa';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt?: string;
  audioUrl?: string;
}

const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Ambient Coding',
    artist: 'Focus Sounds',
    duration: '3:45',
    coverArt: '🎵'
  },
  {
    id: '2',
    title: 'Late Night Development',
    artist: 'Programming Beats',
    duration: '4:20',
    coverArt: '🎧'
  },
  {
    id: '3',
    title: 'Debug Mode',
    artist: 'Developer Vibes',
    duration: '3:15',
    coverArt: '🎼'
  },
  {
    id: '4',
    title: 'Code Review',
    artist: 'Tech Lounge',
    duration: '5:00',
    coverArt: '🎹'
  },
  {
    id: '5',
    title: 'Git Push',
    artist: 'Commit Sounds',
    duration: '3:30',
    coverArt: '🎸'
  },
];

export const Music: React.FC = () => {
  const [tracks] = useState<Track[]>(sampleTracks);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  const parseDuration = (duration: string): number => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const totalDuration = parseDuration(currentTrack.duration);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressInterval.current !== null) {
      window.clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current !== null) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, totalDuration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    let nextIndex;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % tracks.length;
    }

    setCurrentTrack(tracks[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(tracks[prevIndex]);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const clickedTime = (clickX / width) * totalDuration;
    setCurrentTime(clickedTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-pink-600 via-purple-700 to-indigo-900 text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Playlist */}
        <div className="w-72 bg-black bg-opacity-20 backdrop-blur-lg p-4 overflow-y-auto border-r border-white border-opacity-10">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaMusic size={16} />
            Playlist
          </h2>

          <div className="space-y-1.5">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className={`p-2.5 rounded-md cursor-pointer transition-all ${
                  currentTrack.id === track.id
                    ? 'bg-white bg-opacity-15 border border-white border-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-2xl">
                    {track.coverArt}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{track.title}</div>
                    <div className="text-sm text-gray-300 truncate">{track.artist}</div>
                  </div>
                  <div className="text-sm text-gray-300">{track.duration}</div>
                </div>
                {currentTrack.id === track.id && isPlaying && (
                  <div className="mt-2 flex gap-1 items-end h-4">
                    <div className="w-1 bg-white animate-pulse" style={{ height: '60%' }} />
                    <div className="w-1 bg-white animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                    <div className="w-1 bg-white animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                    <div className="w-1 bg-white animate-pulse" style={{ height: '80%', animationDelay: '0.1s' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-md border border-white border-opacity-20 backdrop-blur-sm">
            <p className="text-xs text-white text-opacity-90 leading-relaxed">
              <strong>Note:</strong> This is a music player UI demo. To play actual audio, add MP3 files
              to your public folder and update the audioUrl property in the tracks array.
            </p>
          </div>
        </div>

        {/* Main Player */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full">
            {/* Album Art */}
            <div className="mb-6">
              <div className="w-56 h-56 mx-auto bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-xl shadow-2xl flex items-center justify-center text-7xl transform hover:scale-105 transition-transform">
                {currentTrack.coverArt}
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-1">{currentTrack.title}</h1>
              <p className="text-base text-gray-200">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div
                onClick={handleProgressClick}
                className="h-2 bg-white bg-opacity-20 rounded-full cursor-pointer overflow-hidden group"
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all group-hover:bg-pink-500"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2 text-gray-300">
                <span>{formatTime(currentTime)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={toggleShuffle}
                className={`transition-colors ${
                  isShuffled ? 'text-pink-400' : 'text-gray-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <FaRandom size={20} />
              </button>

              <button
                onClick={handlePrevious}
                className="hover:text-gray-300 transition-colors"
                title="Previous"
              >
                <FaStepBackward size={24} />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-white text-purple-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
              </button>

              <button
                onClick={handleNext}
                className="hover:text-gray-300 transition-colors"
                title="Next"
              >
                <FaStepForward size={24} />
              </button>

              <button
                onClick={toggleRepeat}
                className={`transition-colors ${
                  repeatMode !== 'off' ? 'text-pink-400' : 'text-gray-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <FaRedoAlt size={20} />
                {repeatMode === 'one' && (
                  <span className="text-xs ml-1">1</span>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="hover:text-gray-300 transition-colors">
                {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(236 72 153) 0%, rgb(236 72 153) ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <span className="text-sm text-gray-300 w-8">{isMuted ? 0 : volume}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for future functionality */}
      <audio ref={audioRef} />

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
