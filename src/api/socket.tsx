import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "./config";
import { getAccessToken } from "../utils/tokenStorage";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    const newSocket = io(`${SOCKET_BASE_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
      setConnected(false);
    });

    setSocket((prev) => {
      prev?.disconnect();
      return newSocket;
    });
  }, []);

  const disconnect = useCallback(() => {
    socket?.disconnect();
    setSocket(null);
    setConnected(false);
  }, [socket]);

  // Try once on app start in case a session is already stored (e.g. app was
  // reopened after a previous login). Login/Register screens also call
  // connect() directly right after a fresh sign-in.
  useEffect(() => {
    connect();
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
