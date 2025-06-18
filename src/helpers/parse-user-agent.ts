import { UAParser } from "ua-parser-js";

export function parseUserAgentInfo(userAgent: string) {
    const parser = new UAParser(userAgent);
  
    const browser = parser.getBrowser().name ?? "Navegador desconhecido";
    const os = parser.getOS().name ?? "SO desconhecido";
    const device = parser.getDevice().type ?? "desktop"; // Fallback padrão
  
    return `${browser} • ${os} • ${device}`;
  }
