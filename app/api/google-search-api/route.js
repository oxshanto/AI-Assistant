import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const {
            searchInput,
            searchType,
            conversationHistory = []
        } = await req.json();

        if (!searchInput || !searchInput.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Search input is required"
                },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Gemini API key is missing"
                },
                { status: 500 }
            );
        }

        // Previous conversation history
        const previousMessages = conversationHistory
            .filter(message =>
                message.content &&
                ["user", "assistant", "model"].includes(message.role)
            )
            .map(message => ({
                role: message.role === "assistant" ? "model" : message.role,
                parts: [
                    {
                        text: message.content
                    }
                ]
            }));

        // Add current question
        const contents = [
            ...previousMessages,
            {
                role: "user",
                parts: [
                    {
                        text: searchInput
                    }
                ]
            }
        ];

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
            {
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                timeout: 60000
            }
        );

        const answer = response.data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("\n");

        if (!answer) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Gemini returned an empty response"
                },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            answer,
            searchType
        });

    } catch (error) {

        console.error(
            "GEMINI ERROR:",
            error.response?.data || error.message
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error.response?.data?.error?.message ||
                    error.message
            },
            {
                status: error.response?.status || 500
            }
        );
    }
}