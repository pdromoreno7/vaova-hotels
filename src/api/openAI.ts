'use server';

import { descriptionHotelSchema, descriptionHotelSchemaResponse } from '@/schemas/hotel-description';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

export async function getDescriptionHotel(info: string): Promise<descriptionHotelSchemaResponse> {
  try {
    const { object } = await generateObject({
      // model: google('models/gemini-1.5-pro'),
      model: openai('gpt-4o-mini'),
      schema: descriptionHotelSchema,
      prompt: `Describe en español a este hotel con la siguiete informacion ${info}`,
    });
    return object;
  } catch (error) {
    throw new Error(`Error inesperado en getObjectByModelAi: ${error}`);
  }
}
