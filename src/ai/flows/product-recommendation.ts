// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing product recommendations based on the items in a user's cart.
 *
 * - productRecommendation - An exported function that takes cart items as input and returns product recommendations.
 * - ProductRecommendationInput - The input type for the productRecommendation function, defining the structure of cart items.
 * - ProductRecommendationOutput - The output type for the productRecommendation function, defining the structure of product recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single cart item
const CartItemSchema = z.object({
  productId: z.string().describe('The unique identifier of the product.'),
  name: z.string().describe('The name of the product.'),
  quantity: z.number().int().min(1).describe('The quantity of the product in the cart.'),
  category: z.string().describe('The category of the product'),
});

// Define the input schema for the product recommendation flow
const ProductRecommendationInputSchema = z.object({
  cartItems: z.array(CartItemSchema).describe('An array of items currently in the user\'s shopping cart.'),
});
export type ProductRecommendationInput = z.infer<typeof ProductRecommendationInputSchema>;

// Define the output schema for the product recommendation flow
const ProductRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string().describe('The unique identifier of the recommended product.'),
      name: z.string().describe('The name of the recommended product.'),
      reason: z.string().describe('The reason why this product is recommended based on the cart items.'),
    })
  ).describe('An array of product recommendations based on the items in the cart.'),
});
export type ProductRecommendationOutput = z.infer<typeof ProductRecommendationOutputSchema>;

// Exported function to get product recommendations
export async function productRecommendation(input: ProductRecommendationInput): Promise<ProductRecommendationOutput> {
  return productRecommendationFlow(input);
}

// Define the prompt for generating product recommendations
const productRecommendationPrompt = ai.definePrompt({
  name: 'productRecommendationPrompt',
  input: {schema: ProductRecommendationInputSchema},
  output: {schema: ProductRecommendationOutputSchema},
  prompt: `You are an expert shopping assistant. Given the items in the user's cart, you will provide personalized product recommendations to help them discover related products and potentially increase their purchase value.

  Here are the items in the user's cart:
  {{#each cartItems}}
  - Product ID: {{productId}}, Name: {{name}}, Quantity: {{quantity}}, Category: {{category}}
  {{/each}}

  Provide recommendations based on these items. Explain why each product is recommended in the reason field. Recommendations should be relevant and likely to be of interest to the user given their current cart.
  `,
});

// Define the Genkit flow for product recommendations
const productRecommendationFlow = ai.defineFlow(
  {
    name: 'productRecommendationFlow',
    inputSchema: ProductRecommendationInputSchema,
    outputSchema: ProductRecommendationOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationPrompt(input);
    return output!;
  }
);
