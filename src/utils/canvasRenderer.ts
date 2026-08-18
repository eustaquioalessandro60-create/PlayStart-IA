import { AspectRatio, CreationData } from '../types';

export interface RenderDimensions {
  width: number;
  height: number;
  label: string;
}

export function getDimensionsForFormat(format: AspectRatio): RenderDimensions {
  switch (format) {
    case '16:9':
      return { width: 1920, height: 1080, label: 'YouTube / Horizontal 16:9' };
    case '9:16':
      return { width: 1080, height: 1920, label: 'TikTok / Reels / Kwai / Turistas 9:16' };
    case '1:1':
      return { width: 1080, height: 1080, label: 'Instagram / Facebook Feed 1:1' };
    case '4:5':
      return { width: 1080, height: 1350, label: 'Instagram Portrait 4:5' };
    case '1200x628':
      return { width: 1200, height: 628, label: 'Facebook Link / Banner' };
    default:
      return { width: 1080, height: 1920, label: 'Vertical 9:16' };
  }
}

export function drawMediaFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeSec: number,
  creation: CreationData | null,
  options: {
    showSafeZone?: boolean;
    format: AspectRatio;
  }
) {
  const t = timeSec;
  const isVertical = height > width;

  // Background Gradient strictly within #0F111A, #1E1E2F, Cyan #06B6D4, Blue #3B82F6
  const bgGrad = ctx.createRadialGradient(
    width / 2 + Math.sin(t * 0.8) * (width * 0.15),
    height / 2 + Math.cos(t * 0.6) * (height * 0.15),
    width * 0.1,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.85
  );
  bgGrad.addColorStop(0, '#1E293B');
  bgGrad.addColorStop(0.4, '#1E1E2F');
  bgGrad.addColorStop(1, '#0F111A');

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw cyber grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1.5;
  const gridSize = isVertical ? 60 : 70;
  const offsetX = (t * 20) % gridSize;
  const offsetY = (t * 20) % gridSize;

  for (let x = -gridSize; x < width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + offsetX, 0);
    ctx.lineTo(x + offsetX, height);
    ctx.stroke();
  }
  for (let y = -gridSize; y < height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + offsetY);
    ctx.lineTo(width, y + offsetY);
    ctx.stroke();
  }

  // Draw glowing cyan orb & energy waves
  const orbGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.42,
    10,
    width / 2,
    height * 0.42,
    Math.min(width, height) * 0.38
  );
  orbGrad.addColorStop(0, 'rgba(103, 232, 249, 0.45)');
  orbGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.25)');
  orbGrad.addColorStop(0.7, 'rgba(59, 130, 246, 0.1)');
  orbGrad.addColorStop(1, 'rgba(15, 17, 26, 0)');

  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(width / 2, height * 0.42, Math.min(width, height) * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Draw animated particles
  const particleCount = 28;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.5;
    const px = (width / 2 + Math.cos(seed + t * 0.5) * (width * 0.38 * Math.sin(seed + t * 0.3))) % width;
    const py = (height * 0.42 + Math.sin(seed + t * 0.4) * (height * 0.28)) % height;
    const radius = 2 + Math.sin(seed + t * 2) * 2;

    ctx.fillStyle = i % 2 === 0 ? 'rgba(103, 232, 249, 0.8)' : 'rgba(6, 182, 212, 0.6)';
    ctx.beginPath();
    ctx.arc(px, py, Math.max(1, radius), 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw dynamic AI wave bars in center
  const barCount = 36;
  const barWidth = (width * 0.55) / barCount;
  const startX = width * 0.225;
  const centerY = height * 0.45;

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2;
    const wave1 = Math.sin(angle * 3 + t * 4) * 0.5 + 0.5;
    const wave2 = Math.cos(angle * 2 - t * 3) * 0.5 + 0.5;
    const barH = (wave1 * 0.6 + wave2 * 0.4) * (isVertical ? 160 : 110) + 15;

    const bx = startX + i * barWidth;
    const by = centerY - barH / 2;

    const barGrad = ctx.createLinearGradient(bx, by, bx, by + barH);
    barGrad.addColorStop(0, '#67E8F9');
    barGrad.addColorStop(0.5, '#06B6D4');
    barGrad.addColorStop(1, '#3B82F6');

    ctx.fillStyle = barGrad;
    ctx.fillRect(bx, by, barWidth - 3, barH);
  }

  // Text Content & Typography Overlay
  const titleText = creation?.title || 'PLAYSTART IA';
  const subtitleText = creation?.visualTheme?.subtitle || 'TODAS AS IAS EM UM SÓ LUGAR';
  const promptSummary = creation?.prompt || 'Criando conteúdo automatizado em alta resolução';

  // Header Brand Pill
  ctx.save();
  const brandPillY = isVertical ? height * 0.12 : height * 0.14;
  ctx.fillStyle = 'rgba(30, 30, 47, 0.85)';
  ctx.strokeStyle = '#06B6D4';
  ctx.lineWidth = 2;
  const pillW = Math.min(width * 0.65, 420);
  const pillH = isVertical ? 48 : 42;
  const pillX = (width - pillW) / 2;
  
  ctx.beginPath();
  ctx.roundRect(pillX, brandPillY, pillW, pillH, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#67E8F9';
  ctx.font = `bold ${isVertical ? 20 : 18}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡️ PLAYSTART IA • GRUPO RIMANE', width / 2, brandPillY + pillH / 2);
  ctx.restore();

  // Main Title Text
  ctx.save();
  const titleY = isVertical ? height * 0.68 : height * 0.70;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow shadow
  ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
  ctx.shadowBlur = 24;

  ctx.fillStyle = '#F8FAFC';
  const titleFontSize = isVertical ? Math.min(width * 0.075, 48) : Math.min(width * 0.045, 44);
  ctx.font = `900 ${titleFontSize}px system-ui, sans-serif`;
  ctx.fillText(titleText, width / 2, titleY);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#67E8F9';
  const subFontSize = isVertical ? Math.min(width * 0.042, 24) : Math.min(width * 0.024, 22);
  ctx.font = `600 ${subFontSize}px system-ui, sans-serif`;
  ctx.fillText(subtitleText, width / 2, titleY + (isVertical ? 46 : 38));

  // Prompt summary tag
  const tagY = titleY + (isVertical ? 96 : 76);
  ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
  const promptFontSize = isVertical ? Math.min(width * 0.032, 18) : Math.min(width * 0.020, 16);
  ctx.font = `400 ${promptFontSize}px system-ui, sans-serif`;
  
  // Truncate if long
  const maxChars = isVertical ? 45 : 75;
  const displayPrompt = promptSummary.length > maxChars ? promptSummary.slice(0, maxChars) + '...' : promptSummary;
  ctx.fillText(`"${displayPrompt}"`, width / 2, tagY);

  // Active AI Engine Badges on the bottom
  const enginesY = isVertical ? height * 0.88 : height * 0.88;
  const primaryEngine = creation?.primaryEngine || 'Leonardo IA';
  const videoEngine = creation?.videoEngine || 'Veo 3';
  const voiceEngine = creation?.audioEngine || 'ElevenLabs';

  ctx.fillStyle = 'rgba(30, 30, 47, 0.9)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1.5;
  const badgeW = Math.min(width * 0.85, 600);
  const badgeH = isVertical ? 46 : 38;
  const badgeX = (width - badgeW) / 2;

  ctx.beginPath();
  ctx.roundRect(badgeX, enginesY, badgeW, badgeH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = `500 ${isVertical ? 14 : 13}px system-ui, sans-serif`;
  ctx.fillText(`IAs: ${primaryEngine} • ${videoEngine} • ${voiceEngine} (Fallback Ativo)`, width / 2, enginesY + badgeH / 2);
  ctx.restore();

  // Draw Safe Zone overlay if enabled
  if (options.showSafeZone) {
    drawSafeZoneGuide(ctx, width, height, options.format);
  }
}

function drawSafeZoneGuide(ctx: CanvasRenderingContext2D, width: number, height: number, format: AspectRatio) {
  ctx.save();
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)'; // Alert #EAB308 for guides
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  if (format === '9:16') {
    // Top Safe Zone (Profile / Search header)
    ctx.strokeRect(40, 140, width - 80, height - 380);
    // Right side buttons zone (TikTok / Reels like/share/comment)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.fillRect(width - 120, height * 0.4, 90, height * 0.4);
    // Bottom Caption & Sound zone
    ctx.fillRect(40, height - 220, width - 160, 160);

    ctx.fillStyle = '#EAB308';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚡️ Zona Segura (TikTok / Reels / Kwai)', 50, 130);
  } else if (format === '16:9') {
    // 16:9 TV/Mobile Title safe margin
    ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
    ctx.fillStyle = '#EAB308';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText('⚡️ Limite Seguro YouTube 16:9', width * 0.05 + 10, height * 0.05 - 8);
  } else if (format === '1:1') {
    ctx.strokeRect(width * 0.06, height * 0.06, width * 0.88, height * 0.88);
  }

  ctx.restore();
}

// Download Canvas as PNG image
export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string = 'playstart-ia-media.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

// Generate animated WebM/MP4 video clip from Canvas
export async function recordCanvasToVideo(
  canvas: HTMLCanvasElement,
  durationMs: number = 4000,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      recorder.start();

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
        if (onProgress) onProgress(pct);

        if (elapsed >= durationMs) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
}
