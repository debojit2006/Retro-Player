document.addEventListener('DOMContentLoaded', () => {
    const musicLibrary = [
        // Your Romantic songs
        { title: "Chain Aap Ko", artist: "Unknown Artist", src: "music/Chain Aap Ko .mp3", tags: ["romantic"] },
        { title: "Khuda Bhi", artist: "Unknown Artist", src: "music/Khuda bhi.mp3", tags: ["romantic"] },
        { title: "Khuda Jaane", artist: "Unknown Artist", src: "music/Khuda Jaane.mp3", tags: ["romantic"] },
        { title: "Rishte Naate", artist: "Unknown Artist", src: "music/Rishte Naate.mp3", tags: ["romantic"] },
        { title: "Sawan Aaya Hai", artist: "Unknown Artist", src: "music/Sawan Aay hai .mp3", tags: ["romantic"] },
        { title: "Tu Hi Meri Shab Hai", artist: "Unknown Artist", src: "music/Tu Hi Meri Shab Hai .mp3", tags: ["romantic"] },

        // Example songs for other moods
        { title: "Good Day Sunshine", artist: "The Beatles", src: "music/good-day.mp3", tags: ["happy", "energetic"] },
        { title: "Acoustic Breeze", artist: "Musician", src: "music/acoustic-breeze.mp3", tags: ["happy", "chill"] }
    ];

    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    const songTitleEl = document.getElementById('song-title');
    const artistNameEl = document.getElementById('artist-name');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.querySelector('.progress-bar-container');

    let currentPlaylist = [];
    let currentIndex = -1;

    // --- PLAYER LOGIC ---
    function playSong(index) {
        if (index >= 0 && index < currentPlaylist.length) {
            currentIndex = index;
            const song = currentPlaylist[currentIndex];
            songTitleEl.textContent = song.title;
            artistNameEl.textContent = song.artist;
            audioPlayer.src = song.src;
            audioPlayer.play();
            updatePlayPauseIcon(true);
        }
    }

    function updatePlayPauseIcon(isPlaying) {
        playPauseBtn.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
        lucide.createIcons();
    }

    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused && audioPlayer.src) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.addEventListener('play', () => updatePlayPauseIcon(true));
    audioPlayer.addEventListener('pause', () => updatePlayPauseIcon(false));

    nextBtn.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        playSong(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        playSong(prevIndex);
    });

    // --- MOOD SELECTION LOGIC ---
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            currentPlaylist = musicLibrary.filter(song => song.tags.includes(mood));
            
            moodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (currentPlaylist.length > 0) {
                playSong(0); // Play the first song of the new mood
            } else {
                songTitleEl.textContent = `No songs for ${mood}`;
                artistNameEl.textContent = "...";
                audioPlayer.src = "";
            }
        });
    });
    
    // --- TIME & PROGRESS BAR UPDATE ---
    audioPlayer.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audioPlayer;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            currentTimeEl.textContent = formatTime(currentTime);
            totalDurationEl.textContent = formatTime(duration);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        nextBtn.click(); // Autoplay next song
    });

    progressBarContainer.addEventListener('click', (e) => {
        const width = progressBarContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if(duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
});
