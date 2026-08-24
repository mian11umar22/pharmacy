import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AiUsage from '@/models/AiUsage'
import { requireAdmin } from '@/lib/auth'
import { GoogleGenAI } from '@google/genai'

export async function POST(request) {
    try {
        // 1. Verify Admin Auth
        const auth = await requireAdmin(request)
        if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

        await dbConnect()
        const { name, category, item, tags } = await request.json()

        if (!name) {
            return NextResponse.json({ error: 'Product name is required for generation.' }, { status: 400 })
        }

        // 2. Check Rate Limit (300 per day)
        const today = new Date().toISOString().split('T')[0]
        let usage = await AiUsage.findOne({ date: today })

        if (!usage) {
            usage = await AiUsage.create({ date: today, count: 0 })
        }

        if (usage.count >= 300) {
            return NextResponse.json({ error: 'Daily AI limit reached (300/300). Please try again tomorrow.' }, { status: 429 })
        }

        // 3. Call Official Gemini API
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 })
        }

        let promptText = `You are a clinical pharmacist writing a concise product description for an e-commerce pharmacy website. Write a brief, factual, and SEO-optimized description for '${name}'.`
        if (category) promptText += ` Category: '${category}'.`
        if (item) promptText += ` Type: '${item}'.`
        if (tags) promptText += ` Keywords/Tags: ${tags}.`
        promptText += `\nKeep it very concise (maximum 3-4 short sentences). Focus on: 1) Active ingredients or main purpose, 2) Key benefits, and 3) Basic usage. Do not be overly promotional or write long essays. Format as a single short paragraph, optionally followed by 2-3 brief bullet points. Do not use markdown headers or bold text excessively.`

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: promptText,
        });

        const generatedText = response.text;

        if (!generatedText) {
            return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 500 })
        }

        // 4. Increment Usage
        usage.count += 1
        await usage.save()

        return NextResponse.json({ description: generatedText, usageCount: usage.count }, { status: 200 })

    } catch (error) {
        console.error('Generate description error:', error)
        return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 })
    }
}
