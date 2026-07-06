import { Platform } from 'react-native';

/**
 * Set this to match how you're running the app:
 *
 * - 'simulator' -> iOS Simulator (localhost) or Android Emulator (10.0.2.2, the
 *   emulator's alias for your computer's localhost). Auto-picked by platform below.
 * - 'device'    -> physical phone via Expo Go. 'localhost' resolves to the PHONE,
 *   not your computer, so you MUST use your computer's LAN IP instead - and the
 *   phone + computer must be on the same Wi-Fi network.
 */
const RUNNING_ON: 'simulator' | 'device' = 'device';

const LAN_IP = '192.168.0.31'; // <-- replace with your machine's actual LAN IP when RUNNING_ON = 'device'
const PORT = 3000;

function resolveHost(): string {
  if (RUNNING_ON === 'device') return LAN_IP;
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const API_BASE_URL = `http://${resolveHost()}:${PORT}/api`;
export const UPLOADS_BASE_URL = `http://${resolveHost()}:${PORT}`;
export const SOCKET_BASE_URL = `http://${resolveHost()}:${PORT}`;
