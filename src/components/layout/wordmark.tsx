import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Bildmarke von Autokunst.
 *
 * `public/autokunst-logo.png` ist aus der Originaldatei `public/logo.jpeg` abgeleitet:
 * der leere schwarze Rand ist weggeschnitten (Ausschnitt 59/448, 1034×395) und der flache
 * schwarze Hintergrund ist freigestellt. Die Grafik selbst – Farben, Verlauf, Proportionen –
 * bleibt unverändert; ohne Freistellung läge über dem transparenten Header der Startseite
 * ein sichtbares schwarzes Rechteck.
 *
 * Das Seitenverhältnis 1034:395 hält `w-auto` in jeder Größe.
 */
export function Wordmark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/autokunst-logo.png"
      alt="Autokunst"
      width={1034}
      height={395}
      priority={priority}
      sizes="200px"
      className={cn('h-8 w-auto md:h-9', className)}
    />
  );
}
