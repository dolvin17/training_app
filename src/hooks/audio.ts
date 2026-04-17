export const playTimerBeep = (repeats = 3) => {
  if ("vibrate" in navigator) {
    const pattern = [];
    for (let i = 0; i < repeats; i++) {
      pattern.push(200);
      if (i < repeats - 1) pattern.push(100);
    }
    navigator.vibrate(pattern);
  }
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  for (let i = 0; i < repeats; i++) {
    const startTime = audioCtx.currentTime + i * 0.3;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, startTime);

    // Fade in y Fade out rápido para evitar el "pop" de audio
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }
};
