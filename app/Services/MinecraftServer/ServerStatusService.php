<?php

namespace App\Services\MinecraftServer;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServerStatusService
{
    /**
     * API providers in order of preference.
     *
     * @var array<string, array{url: string, parser: string}>
     */
    private const API_PROVIDERS = [
        'mcsrvstat' => [
            'url' => 'https://api.mcsrvstat.us/3/',
            'parser' => 'parseMcsrvstat',
        ],
        'mcstatus' => [
            'url' => 'https://api.mcstatus.io/v2/status/java/',
            'parser' => 'parseMcstatus',
        ],
    ];

    /**
     * Check the status of a Minecraft server using multiple sources.
     *
     * @param  string  $address  The server address (e.g., 'hypixel.net' or 'play.example.com:25566')
     * @return array<string, mixed>
     */
    public function checkStatus(string $address): array
    {
        // Parse address to get host and port
        [$host, $port] = $this->parseAddress($address);

        // Try each API provider
        foreach (self::API_PROVIDERS as $name => $provider) {
            $result = $this->tryApiProvider($name, $provider, $address);
            if ($result !== null && $result['online']) {
                $result['source'] = $name;

                return $result;
            }
        }

        // All APIs failed or returned offline, try direct ping as last resort
        $directResult = $this->directPing($host, $port);
        if ($directResult !== null && $directResult['online']) {
            $directResult['source'] = 'direct';

            return $directResult;
        }

        // If direct ping got a response but server is offline, return that
        if ($directResult !== null) {
            return $directResult;
        }

        // All methods failed
        return $this->getOfflineStatus($address, 'Could not reach server through any method. The server may be offline or blocking status queries.');
    }

    /**
     * Parse server address into host and port.
     *
     * @return array{0: string, 1: int}
     */
    private function parseAddress(string $address): array
    {
        $parts = explode(':', $address);
        $host = $parts[0];
        $port = isset($parts[1]) ? (int) $parts[1] : 25565;

        return [$host, $port];
    }

    /**
     * Try a specific API provider.
     *
     * @param  array{url: string, parser: string}  $provider
     * @return array<string, mixed>|null
     */
    private function tryApiProvider(string $name, array $provider, string $address): ?array
    {
        try {
            $response = Http::timeout(10)
                ->connectTimeout(5)
                ->get($provider['url'].$address);

            if (! $response->successful()) {
                Log::debug("Server status API {$name} returned non-success", [
                    'address' => $address,
                    'status' => $response->status(),
                ]);

                return null;
            }

            $data = $response->json();
            $parser = $provider['parser'];

            return $this->$parser($data, $address);
        } catch (\Exception $e) {
            Log::debug("Server status API {$name} failed", [
                'address' => $address,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Parse response from mcsrvstat.us API.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function parseMcsrvstat(array $data, string $address): array
    {
        if (! isset($data['online']) || ! $data['online']) {
            return $this->getOfflineStatus($address, 'Server is offline or unreachable.');
        }

        return [
            'success' => true,
            'online' => true,
            'address' => $address,
            'hostname' => $data['hostname'] ?? $address,
            'port' => $data['port'] ?? 25565,
            'ip' => $data['ip'] ?? null,
            'players' => [
                'online' => $data['players']['online'] ?? 0,
                'max' => $data['players']['max'] ?? 0,
                'list' => $data['players']['list'] ?? [],
            ],
            'version' => $data['version'] ?? 'Unknown',
            'motd' => [
                'raw' => $data['motd']['raw'] ?? [],
                'clean' => $data['motd']['clean'] ?? [],
                'html' => $data['motd']['html'] ?? [],
            ],
            'icon' => $data['icon'] ?? null,
            'software' => $data['software'] ?? null,
            'protocol' => [
                'version' => $data['protocol']['version'] ?? null,
                'name' => $data['protocol']['name'] ?? null,
            ],
        ];
    }

    /**
     * Parse response from mcstatus.io API.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function parseMcstatus(array $data, string $address): array
    {
        if (! isset($data['online']) || ! $data['online']) {
            return $this->getOfflineStatus($address, 'Server is offline or unreachable.');
        }

        // Convert MOTD to expected format
        $motdRaw = [];
        $motdClean = [];
        $motdHtml = [];

        if (isset($data['motd'])) {
            $motdRaw = $data['motd']['raw'] ?? [];
            $motdClean = $data['motd']['clean'] ?? [];
            $motdHtml = $data['motd']['html'] ?? [];
        }

        return [
            'success' => true,
            'online' => true,
            'address' => $address,
            'hostname' => $data['host'] ?? $address,
            'port' => $data['port'] ?? 25565,
            'ip' => $data['ip_address'] ?? null,
            'players' => [
                'online' => $data['players']['online'] ?? 0,
                'max' => $data['players']['max'] ?? 0,
                'list' => array_map(fn ($p) => $p['name_raw'] ?? $p['name_clean'] ?? 'Unknown', $data['players']['list'] ?? []),
            ],
            'version' => $data['version']['name_raw'] ?? $data['version']['name_clean'] ?? 'Unknown',
            'motd' => [
                'raw' => is_array($motdRaw) ? $motdRaw : [$motdRaw],
                'clean' => is_array($motdClean) ? $motdClean : [$motdClean],
                'html' => is_array($motdHtml) ? $motdHtml : [$motdHtml],
            ],
            'icon' => $data['icon'] ?? null,
            'software' => $data['software'] ?? null,
            'protocol' => [
                'version' => $data['version']['protocol'] ?? null,
                'name' => $data['version']['name_clean'] ?? null,
            ],
        ];
    }

    /**
     * Protocol versions to try (newest to oldest).
     * Maps protocol number to Minecraft version name.
     *
     * @var array<int, string>
     */
    private const PROTOCOL_VERSIONS = [
        767 => '1.21.1',   // Latest
        766 => '1.20.6',
        765 => '1.20.4',
        764 => '1.20.2',
        763 => '1.20.1',
        762 => '1.19.4',
        761 => '1.19.3',
        760 => '1.19.2',
        759 => '1.19.1',
        758 => '1.18.2',
        757 => '1.18.1',
        756 => '1.17.1',
        754 => '1.16.5',
        753 => '1.16.4',
        736 => '1.16.1',
        578 => '1.15.2',
        498 => '1.14.4',
        404 => '1.13.2',
        340 => '1.12.2',
        315 => '1.11',
        210 => '1.10.2',
        110 => '1.9.4',
        47 => '1.8.9',     // Very common legacy version
    ];

    /**
     * Perform a direct Minecraft server ping using the protocol.
     *
     * @return array<string, mixed>|null
     */
    private function directPing(string $host, int $port): ?array
    {
        try {
            // Resolve SRV record for Minecraft servers
            $srvRecords = @dns_get_record('_minecraft._tcp.'.$host, DNS_SRV);
            if (! empty($srvRecords)) {
                $srv = $srvRecords[0];
                $host = rtrim($srv['target'], '.');
                $port = $srv['port'];
            }

            // Try different protocol versions
            foreach (self::PROTOCOL_VERSIONS as $protocolVersion => $versionName) {
                $result = $this->tryDirectPingWithProtocol($host, $port, $protocolVersion);
                if ($result !== null) {
                    return $result;
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::debug('Direct ping failed', [
                'host' => $host,
                'port' => $port,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Try direct ping with a specific protocol version.
     *
     * @return array<string, mixed>|null
     */
    private function tryDirectPingWithProtocol(string $host, int $port, int $protocolVersion): ?array
    {
        // Connect to server
        $socket = @fsockopen($host, $port, $errno, $errstr, 3);
        if (! $socket) {
            Log::debug('Direct ping connection failed', [
                'host' => $host,
                'port' => $port,
                'protocol' => $protocolVersion,
                'errno' => $errno,
                'errstr' => $errstr,
            ]);

            return null;
        }

        stream_set_timeout($socket, 3);

        try {
            // Build handshake packet
            $handshake = $this->buildHandshakePacket($host, $port, $protocolVersion);
            fwrite($socket, $handshake);

            // Send status request
            fwrite($socket, "\x01\x00");

            // Read response
            $response = $this->readMinecraftResponse($socket);
            fclose($socket);

            if ($response === null) {
                return null;
            }

            return $this->parseDirectPingResponse($response, $host.($port !== 25565 ? ':'.$port : ''));
        } catch (\Exception $e) {
            @fclose($socket);

            return null;
        }
    }

    /**
     * Build Minecraft handshake packet.
     */
    private function buildHandshakePacket(string $host, int $port, int $protocolVersion = 767): string
    {
        $data = "\x00"; // Packet ID
        $data .= $this->packVarInt($protocolVersion); // Protocol version
        $data .= $this->packVarInt(strlen($host)).$host; // Host
        $data .= pack('n', $port); // Port (unsigned short, big-endian)
        $data .= "\x01"; // Next state (1 = status)

        return $this->packVarInt(strlen($data)).$data;
    }

    /**
     * Pack an integer as VarInt.
     */
    private function packVarInt(int $value): string
    {
        $result = '';
        while (true) {
            if (($value & ~0x7F) === 0) {
                $result .= chr($value);
                break;
            }
            $result .= chr(($value & 0x7F) | 0x80);
            $value >>= 7;
        }

        return $result;
    }

    /**
     * Read VarInt from socket.
     *
     * @param  resource  $socket
     */
    private function readVarInt($socket): ?int
    {
        $result = 0;
        $shift = 0;

        for ($i = 0; $i < 5; $i++) {
            $byte = fread($socket, 1);
            if ($byte === false || strlen($byte) === 0) {
                return null;
            }
            $byte = ord($byte);
            $result |= ($byte & 0x7F) << $shift;
            if (($byte & 0x80) === 0) {
                return $result;
            }
            $shift += 7;
        }

        return null;
    }

    /**
     * Read Minecraft response from socket.
     *
     * @param  resource  $socket
     */
    private function readMinecraftResponse($socket): ?string
    {
        // Read packet length
        $packetLength = $this->readVarInt($socket);
        if ($packetLength === null || $packetLength <= 0) {
            return null;
        }

        // Read packet ID
        $packetId = $this->readVarInt($socket);
        if ($packetId === null || $packetId !== 0) {
            return null;
        }

        // Read string length
        $stringLength = $this->readVarInt($socket);
        if ($stringLength === null || $stringLength <= 0) {
            return null;
        }

        // Read JSON data
        $json = '';
        $remaining = $stringLength;
        while ($remaining > 0) {
            $chunk = fread($socket, min($remaining, 8192));
            if ($chunk === false || strlen($chunk) === 0) {
                break;
            }
            $json .= $chunk;
            $remaining -= strlen($chunk);
        }

        return $json ?: null;
    }

    /**
     * Parse direct ping JSON response.
     *
     * @return array<string, mixed>
     */
    private function parseDirectPingResponse(string $json, string $address): array
    {
        $data = json_decode($json, true);

        if (! $data) {
            return $this->getOfflineStatus($address, 'Invalid response from server.');
        }

        // Extract MOTD
        $motdRaw = [];
        $motdClean = [];
        $motdHtml = [];

        if (isset($data['description'])) {
            $description = $data['description'];
            if (is_string($description)) {
                $motdRaw = [$description];
                $motdClean = [preg_replace('/\x{00A7}[0-9a-fk-or]/u', '', $description)];
                $motdHtml = [$this->motdToHtml($description)];
            } elseif (is_array($description)) {
                $text = $description['text'] ?? '';
                if (isset($description['extra'])) {
                    foreach ($description['extra'] as $extra) {
                        $text .= $extra['text'] ?? '';
                    }
                }
                $motdRaw = [$text];
                $motdClean = [preg_replace('/\x{00A7}[0-9a-fk-or]/u', '', $text)];
                $motdHtml = [$this->motdToHtml($text)];
            }
        }

        return [
            'success' => true,
            'online' => true,
            'address' => $address,
            'hostname' => $address,
            'port' => 25565,
            'ip' => null,
            'players' => [
                'online' => $data['players']['online'] ?? 0,
                'max' => $data['players']['max'] ?? 0,
                'list' => array_map(fn ($p) => $p['name'] ?? 'Unknown', $data['players']['sample'] ?? []),
            ],
            'version' => $data['version']['name'] ?? 'Unknown',
            'motd' => [
                'raw' => $motdRaw,
                'clean' => $motdClean,
                'html' => $motdHtml,
            ],
            'icon' => isset($data['favicon']) ? $data['favicon'] : null,
            'software' => null,
            'protocol' => [
                'version' => $data['version']['protocol'] ?? null,
                'name' => $data['version']['name'] ?? null,
            ],
        ];
    }

    /**
     * Convert Minecraft color codes to HTML.
     */
    private function motdToHtml(string $text): string
    {
        $colors = [
            '0' => '#000000', '1' => '#0000AA', '2' => '#00AA00', '3' => '#00AAAA',
            '4' => '#AA0000', '5' => '#AA00AA', '6' => '#FFAA00', '7' => '#AAAAAA',
            '8' => '#555555', '9' => '#5555FF', 'a' => '#55FF55', 'b' => '#55FFFF',
            'c' => '#FF5555', 'd' => '#FF55FF', 'e' => '#FFFF55', 'f' => '#FFFFFF',
        ];

        $result = '';
        $currentColor = null;
        $bold = false;
        $italic = false;
        $underline = false;
        $strikethrough = false;

        $i = 0;
        $len = strlen($text);

        while ($i < $len) {
            // Check for color code (§ or \u00A7)
            if (($text[$i] === "\xC2" && $i + 2 < $len && $text[$i + 1] === "\xA7") ||
                ($text[$i] === "\xA7")) {
                $offset = ($text[$i] === "\xC2") ? 2 : 1;
                $code = strtolower($text[$i + $offset] ?? '');

                if (isset($colors[$code])) {
                    $currentColor = $colors[$code];
                    $bold = $italic = $underline = $strikethrough = false;
                } elseif ($code === 'l') {
                    $bold = true;
                } elseif ($code === 'o') {
                    $italic = true;
                } elseif ($code === 'n') {
                    $underline = true;
                } elseif ($code === 'm') {
                    $strikethrough = true;
                } elseif ($code === 'r') {
                    $currentColor = null;
                    $bold = $italic = $underline = $strikethrough = false;
                }

                $i += $offset + 1;

                continue;
            }

            // Build style
            $styles = [];
            if ($currentColor) {
                $styles[] = "color: {$currentColor}";
            }
            if ($bold) {
                $styles[] = 'font-weight: bold';
            }
            if ($italic) {
                $styles[] = 'font-style: italic';
            }
            if ($underline) {
                $styles[] = 'text-decoration: underline';
            }
            if ($strikethrough) {
                $styles[] = 'text-decoration: line-through';
            }

            $char = htmlspecialchars($text[$i], ENT_QUOTES, 'UTF-8');

            if (! empty($styles)) {
                $result .= '<span style="'.implode('; ', $styles).'">'.$char.'</span>';
            } else {
                $result .= $char;
            }

            $i++;
        }

        return $result;
    }

    /**
     * Get offline status response.
     *
     * @return array<string, mixed>
     */
    private function getOfflineStatus(string $address, string $reason = 'Server is offline or unreachable.'): array
    {
        return [
            'success' => true,
            'online' => false,
            'address' => $address,
            'error' => $reason,
        ];
    }
}
