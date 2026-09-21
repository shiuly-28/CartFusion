/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";


const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/interactions"

export async function POST(req:NextRequest){
    try{
        const {message, role, targetRole} = await req.json()
        if(!message || !role || !targetRole){
            return NextResponse.json({suggestions: []})
        }

        const roleMatrix: Record<string, string> = {

            "user_merchant": `
            You are replying as a USER to a MERCHANT.
            
            GOAL: 
            Request help or clarification.
            
            RULES:
            -Clearly explain  the issue or request 
            - Be polite and respectful
            - Do not sound demanding or accusatory
            - Do not propose solutions yourself
            - Ask only what is necessary `,

            "Merchant_User": `
            You are replying as a MERCHANT to USER.

            GOAL: 
            Assist the user professionally.

            RULES:
            - Be solution-oriented
            - Acknowledge the user's concern
            - Avoid blamimg the user 
            - Do not overpromise timelines or refunds
            - Ask for details only if required
            `,

            "merchant_admin": `
            You are replying as a MERCHANT to ADMIN.

            GOAL: 
            Escalate or clarify an issue.

            RULES:
            - Be factual and concise
            - Clearly state the problem
            - Include relevent tecnical or operational context
            - Ask for guidance or approval if needed
            - Avoid emotional language
            `,

            "admin_merchant": `
            You are replying as an ADMIN to MERCHANT
            
            GOAL: 
            RResolve or guide.
            
            RULES: 
            - Be authoritative but fair
            - Request missing information if needed
            - Provide clear next steps when possible
            - Avoid unnecessary explainations`
        };

        const rolekey = `${role}_${targetRole}`;
        const roleContext = roleMatrix[rolekey] || "";

        const prompt = `
        You are an AI assistant specialized in short, professional support replise.
        ROLE & CONTEXT:
        ${roleContext}
        
        CONVERSATION CONTEXT:
        The last message you recevived is:
        "${message}"

        OBJECTIVE:
        Generate exactly THREE reply suggestions that are suitable for sending directly to the other party.

        STRICT OUTPUT RULES:
        - Each reply must be betwween 5 words or  short
        - polite, professional, and  netural tone
        - Clear and  context-aware
        - No emojis 
        - No explantions
        - No greetings like "Hi" or "Hello"
        - No repetiton across suggestions
        - One reply per line
        - No numbering, bullets, or symbols

        QUALITY RULES: 
        - Replies must logically respond to the message
        - Do NOT invent facts, promises, or timelines
        - If information is missing, polietly request clarification
        - Avoid generic phrases like "Let me know" unless appropriate
        - Sound human, not robotic

        OUTPUT FORMAT:
        Plain text only.
        Exactly three lines.
        `;

       const geminiResponse = await fetch(
    `${geminiUrl}?key=${process.env.GEMINI_API_KEY}`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
       body: JSON.stringify({
    model: "models/gemini-3-flash-preview",
    input: prompt,
    generation_config: {
        temperature: 0.7,
        max_output_tokens: 500,
        top_p: 0.95,
        thinking_level: "low"   // ✅ thinking কমিয়ে দিলাম, output এর জন্য বেশি বাজেট থাকবে
    }
}),
    }
);

const data = await geminiResponse.json()
console.log("GEMINI STATUS:", geminiResponse.status);
console.log("GEMINI RAW RESPONSE:", JSON.stringify(data));

// ✅ নতুন parsing logic — steps অ্যারে থেকে model_output খুঁজে বের করো
const modelOutputStep = data?.steps?.find((step: any) => step.type === "model_output");
const text = modelOutputStep?.content
    ?.map((c: any) => c.text)
    .join("\n") || "";

const suggestions = text
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

        return NextResponse.json({suggestions})
    }catch(error){
        console.log("Suggestion error:", error);
        return NextResponse.json({suggestions: [] });
    }
}