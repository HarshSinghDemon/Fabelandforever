'use server';
/**
 * @fileOverview A Genkit flow for generating custom crochet design ideas.
 *
 * - generateCustomCrochetIdeas - A function that generates unique crochet design ideas.
 * - GenerateCustomCrochetIdeasInput - The input type for the generateCustomCrochetIdeas function.
 * - GenerateCustomCrochetIdeasOutput - The return type for the generateCustomCrochetIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomCrochetIdeasInputSchema = z.object({
  itemType: z
    .string()
    .describe('The type of crochet item the customer is interested in (e.g., blanket, scarf, toy, coaster).'),
  color: z
    .string()
    .optional()
    .describe('Desired color palette or specific colors (e.g., teal, cream, pastel, earth tones).'),
  style: z
    .string()
    .optional()
    .describe('Preferred aesthetic style (e.g., modern, boho, minimalist, vintage, whimsical).'),
  occasion: z
    .string()
    .optional()
    .describe('The occasion or purpose for the item (e.g., baby shower, wedding gift, home decor, christmas).'),
});
export type GenerateCustomCrochetIdeasInput = z.infer<typeof GenerateCustomCrochetIdeasInputSchema>;

const GenerateCustomCrochetIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of unique and creative crochet design ideas.'),
});
export type GenerateCustomCrochetIdeasOutput = z.infer<typeof GenerateCustomCrochetIdeasOutputSchema>;

export async function generateCustomCrochetIdeas(
  input: GenerateCustomCrochetIdeasInput
): Promise<GenerateCustomCrochetIdeasOutput> {
  return generateCustomCrochetIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomCrochetIdeasPrompt',
  input: { schema: GenerateCustomCrochetIdeasInputSchema },
  output: { schema: GenerateCustomCrochetIdeasOutputSchema },
  prompt: `You are an AI assistant specialized in generating creative and unique crochet design ideas.
Your goal is to inspire customers for custom orders by suggesting innovative designs based on their preferences.

Generate 3-5 distinct and inspiring crochet design ideas based on the following criteria:

Item Type: {{{itemType}}}
{{#if color}}Color Palette: {{{color}}}{{/if}}
{{#if style}}Style: {{{style}}}{{/if}}
{{#if occasion}}Occasion: {{{occasion}}}{{/if}}

Each idea should be a concise yet descriptive suggestion, focusing on how the various elements combine to create a unique piece. Consider patterns, textures, and potential embellishments.

Present the ideas as a JSON array of strings.`,
});

const generateCustomCrochetIdeasFlow = ai.defineFlow(
  {
    name: 'generateCustomCrochetIdeasFlow',
    inputSchema: GenerateCustomCrochetIdeasInputSchema,
    outputSchema: GenerateCustomCrochetIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
