const nodeFetch = require("node-fetch");
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Sarvam TTS Service
 * Provides text-to-speech functionality using Sarvam.ai API
 */

/**
 * Convert 16-bit linear PCM to µ-law (G.711)
 * Copied from tts_controller.js for consistency
 * @param {Buffer} pcmBuffer - 16-bit PCM buffer
 * @returns {Buffer} - 8-bit µ-law buffer
 */
function pcmToMuLaw(pcmBuffer) {
    const muLawBuffer = Buffer.alloc(pcmBuffer.length / 2);

    for (let i = 0; i < pcmBuffer.length; i += 2) {
        let sample = pcmBuffer.readInt16LE(i);

        // Clamp sample
        if (sample > 32767) sample = 32767;
        if (sample < -32768) sample = -32768;

        // Encode to Mu-Law
        const sign = (sample < 0) ? 0x80 : 0;
        if (sample < 0) sample = -sample;
        sample = sample + 132;
        if (sample > 32767) sample = 32767;

        const exponent = [7, 6, 5, 4, 3, 2, 1, 0].find(e => sample >= (1 << (e + 5))) || 0;
        const mantissa = (sample >> (exponent + 1)) & 0x0F;
        const muLawByte = ~(sign | (exponent << 4) | mantissa);

        muLawBuffer[i / 2] = muLawByte;
    }
    return muLawBuffer;
}

/**
 * Detect audio format by inspecting magic numbers (file signatures)
 * @param {Buffer} buffer - Audio buffer to inspect
 * @returns {string} - Detected format: 'mp3', 'wav', 's16le', or 'unknown'
 */
function detectAudioFormat(buffer) {
    if (buffer.length < 4) return 'unknown';

    // Check for MP3 (ID3 tag or MPEG frame sync)
    if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
        return 'mp3'; // ID3v2 tag
    }
    if (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0) {
        return 'mp3'; // MPEG frame sync
    }

    // Check for WAV (RIFF header)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        return 'wav'; // RIFF
    }

    // If no recognizable header, assume raw PCM (signed 16-bit little-endian)
    return 's16le';
}

/**
 * Convert audio buffer to PCM S16LE 8kHz using ffmpeg (File-based)
 * @param {Buffer} audioBuffer - Input audio buffer
 * @param {string} sourceFormat - Source audio format
 * @returns {Promise<Buffer>} - PCM 8kHz buffer
 */
async function convertToPcm8k(audioBuffer, sourceFormat) {
    return new Promise((resolve, reject) => {
        // Create temp files
        const tempDir = os.tmpdir();
        const inputExt = sourceFormat === 's16le' ? 'pcm' : sourceFormat;
        const inputFile = path.join(tempDir, `sarvam_input_${Date.now()}.${inputExt}`);
        const outputFile = path.join(tempDir, `sarvam_output_${Date.now()}.pcm`);

        try {
            // Write input to temp file
            fs.writeFileSync(inputFile, audioBuffer);

            // Build ffmpeg args
            // We want strict S16LE 8kHz Mono output
            const args = [
                '-y',
                '-i', inputFile,
                '-f', 's16le',
                '-ar', '8000',
                '-ac', '1',
                '-acodec', 'pcm_s16le',
                outputFile
            ];

            // If input is raw PCM, suggest input format params (assume 24kHz or let ffmpeg guess? Sarvam usually MP3/WAV now)
            // But if we forced 8k in request, input might be 8k.
            // Safe to let ffmpeg auto-detect if container exists (wav/mp3).
            // If raw s16le, we might need to specify input rate.
            if (sourceFormat === 's16le') {
                // Prepend input format args
                args.unshift('-ac', '1');
                args.unshift('-ar', '24000'); // Assume 24k default for raw Sarvam legacy? 
                args.unshift('-f', 's16le');
            }

            const ffmpeg = spawn('ffmpeg', args);

            ffmpeg.on('close', (code) => {
                cleanup();
                if (code !== 0) {
                    reject(new Error(`ffmpeg exited with code ${code}`));
                    return;
                }

                if (fs.existsSync(outputFile)) {
                    const pcmData = fs.readFileSync(outputFile);
                    fs.unlinkSync(outputFile);
                    resolve(pcmData);
                } else {
                    reject(new Error('Output file not created'));
                }
            });

            ffmpeg.on('error', (err) => {
                cleanup();
                reject(err);
            });

            function cleanup() {
                if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            }

        } catch (err) {
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            reject(err);
        }
    });
}

/**
 * Generate speech audio using Sarvam TTS API
 * @param {string} text - The text to convert to speech
 * @param {Object} options - TTS options
 * @returns {Promise<Buffer>} - Audio buffer in ulaw_8000 format for Twilio
 */
async function generateSarvamTTS(text, options = {}) {
    try {
        const apiKey = process.env.SARVAM_API_KEY;

        if (!apiKey) {
            throw new Error("SARVAM_API_KEY not configured in environment variables");
        }

        const language = options.language || process.env.SARVAM_TTS_LANGUAGE || "en-IN";
        const speaker = options.speaker || process.env.SARVAM_TTS_SPEAKER || "anushka";

        console.log(`[TTS] Using provider: Sarvam`);
        console.log(`   Text: "${text.substring(0, 50)}..."`);
        console.log(`   Speaker: ${speaker}`);

        // Request 8kHz audio directly from Sarvam to match Twilio requirements
        const response = await nodeFetch(
            "https://api.sarvam.ai/text-to-speech",
            {
                method: "POST",
                headers: {
                    "api-subscription-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: [text],
                    target_language_code: language,
                    speaker: speaker,
                    model: "bulbul:v2",
                    enable_preprocessing: true,
                    speech_sample_rate: 8000 // Force 8kHz
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Sarvam API error: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        const base64Audio = jsonResponse.audios && jsonResponse.audios[0];

        if (!base64Audio) {
            throw new Error('No audio data in Sarvam response');
        }

        const audioBuffer = Buffer.from(base64Audio, 'base64');
        console.log(`[TTS] Sarvam raw audio size: ${audioBuffer.length} bytes`);

        // Check format
        const actualFormat = detectAudioFormat(audioBuffer);
        console.log(`[TTS] Detected Sarvam format: ${actualFormat}`);

        // Robust 2-Step Conversion: Source -> PCM 8k -> MuLaw
        // Step 1: Convert to PCM 8k (using FFmpeg)
        const pcmBuffer = await convertToPcm8k(audioBuffer, actualFormat);
        console.log(`[TTS] Converted to PCM 8k: ${pcmBuffer.length} bytes`);

        // Step 2: Encode to MuLaw (using JS)
        const ulawBuffer = pcmToMuLaw(pcmBuffer);
        console.log(`[TTS] Encoded to MuLaw: ${ulawBuffer.length} bytes`);

        return ulawBuffer;

    } catch (error) {
        console.error("[TTS] Error in Sarvam TTS:", error.message);
        throw error;
    }
}

module.exports = {
    generateSarvamTTS, // Export MUST match what tts_controller requires
};
