import { createClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || 'dummy_key' });

export async function storeMemory(userId: string, data: any) {
  // Mock store memory logic
  console.log(`Storing memory for ${userId}`, data);
  return { success: true };
}

export async function retrieveMemory(userId: string, query: string) {
  // Mock retrieve memory logic based on context
  console.log(`Retrieving memory for ${userId} with query: ${query}`);
  return {
    pastActions: [],
    preferences: {},
    contacts: [{ name: "Investor A", email: "investor@example.com" }]
  };
}
