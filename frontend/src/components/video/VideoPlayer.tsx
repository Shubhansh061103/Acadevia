'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiPlay,
    FiPause,
    FiVolume2,
    FiVolumeX,
    FiMaximize,
    FiSettings,
    FiSkipForward,
    FiSkipBack,
} from 'react-icons/fi';

interface VideoPlayerProps {
    src: string;
    title: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    nextVideo?: () => void;
    previousVideo?: () => void;
}

export function VideoPlayer({
    src,
    title,
    onProgress,
    onComplete,
    nextVideo,
    previousVideo,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => {
            setCurrentTime(video.currentTime);
            if (onProgress) {
                onProgress((video.currentTime / video.duration) * 100);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            if (onComplete) {
                onComplete();
            }
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, [onProgress, onComplete]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);

            if (isPlaying) {
                timeout = setTimeout(() => {
                    setShowControls(false);
                }, 3000);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', () => {
                if (isPlaying) setShowControls(false);
            });
        }

        return () => {
            clearTimeout(timeout);
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isPlaying]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newTime = parseFloat(e.target.value);
        video.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const changePlaybackRate = (rate: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(false);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const skipForward = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.min(video.currentTime + 10, video.duration);
    };

    const skipBackward = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(video.currentTime - 10, 0);
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden group"
            onDoubleClick={toggleFullscreen}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full"
                onClick={togglePlay}
            />

            {/* Controls Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
            />

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
                className="absolute top-4 left-4 right-4"
            >
                <h3 className="text-white text-lg font-semibold">{title}</h3>
            </motion.div>

            {/* Center Play Button */}
            {!isPlaying && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <FiPlay className="w-10 h-10 text-white ml-1" />
                    </div>
                </motion.button>
            )}

            {/* Bottom Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ pointerEvents: showControls ? 'auto' : 'none' }}
            >
                {/* Progress Bar */}
                <div className="mb-4">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={seek}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.3) 100%)`,
                        }}
                    />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Previous Button */}
                        {previousVideo && (
                            <button
                                onClick={previousVideo}
                                className="text-white hover:text-purple-400 transition-colors"
                            >
                                <FiSkipBack className="w-6 h-6" />
                            </button>
                        )}

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-purple-400 transition-colors"
                        >
                            {isPlaying ? (
                                <FiPause className="w-6 h-6" />
                            ) : (
                                <FiPlay className="w-6 h-6" />
                            )}
                        </button>

                        {/* Next Button */}
                        {nextVideo && (
                            <button
                                onClick={nextVideo}
                                className="text-white hover:text-purple-400 transition-colors"
                            >
                                <FiSkipForward className="w-6 h-6" />
                            </button>
                        )}

                        {/* Skip Buttons */}
                        <button
                            onClick={skipBackward}
                            className="text-white hover:text-purple-400 transition-colors"
                            title="Skip 10s backward"
                        >
                            <span className="text-sm">-10s</span>
                        </button>

                        <button
                            onClick={skipForward}
                            className="text-white hover:text-purple-400 transition-colors"
                            title="Skip 10s forward"
                        >
                            <span className="text-sm">+10s</span>
                        </button>

                        {/* Volume Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-purple-400 transition-colors"
                            >
                                {isMuted ? (
                                    <FiVolumeX className="w-5 h-5" />
                                ) : (
                                    <FiVolume2 className="w-5 h-5" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={changeVolume}
                                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Time Display */}
                        <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Settings */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-white hover:text-purple-400 transition-colors"
                            >
                                <FiSettings className="w-5 h-5" />
                            </button>

                            {showSettings && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 min-w-[150px]"
                                >
                                    <p className="text-white text-xs mb-2">Playback Speed</p>
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                        <button
                                            key={rate}
                                            onClick={() => changePlaybackRate(rate)}
                                            className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-800 transition-colors ${playbackRate === rate ? 'text-purple-400' : 'text-white'
                                                }`}
                                        >
                                            {rate}x
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-purple-400 transition-colors"
                        >
                            <FiMaximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}