import { Pinecone } from '@pinecone-database/pinecone';

// Safe initialization
let pinecone: Pinecone | null = null;
try {
  if (process.env.PINECONE_API_KEY) {
      pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }
} catch (e) { console.warn("Pinecone init failed."); }

async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return new Array(768).fill(0); // Dummy fallback shape

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/text-embedding-004",
      content: { parts: [{ text }] }
    })
  });
  
  if (!res.ok) throw new Error("Gemini Embedding failed");
  const data = await res.json();
  return data.embedding.values;
}

export async function storeMemory(userId: string, data: any) {
  console.log(`Storing explicit memory for ${userId}:`, data);
  if (!pinecone) return { success: false, reason: "No Pinecone Client" };

  try {
      const memoryText = typeof data === 'string' ? data : JSON.stringify(data);
      const vector = await getEmbedding(memoryText);
      const index = pinecone.Index('neuroflow'); // Assumes generic index
      
      const record = {
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          values: vector,
          metadata: { userId, text: memoryText, timestamp: Date.now() }
      };
      
      await (index.upsert as any)([record]);
      return { success: true };
  } catch (err) {
      console.error("Store error:", err);
      return { success: false };
  }
}

export async function retrieveMemory(userId: string, query: string) {
  console.log(`Retrieving memory for ${userId} with query: ${query}`);
  if (!pinecone || !query || query.length < 3) return { preferences: [], contacts: [] };

  try {
      const vector = await getEmbedding(query);
      const index = pinecone.Index('neuroflow');
      
      const results = await index.query({
          vector,
          topK: 3,
          includeMetadata: true,
          // filter: { userId: { $eq: userId } } // Enable if strict multi-tenant
      });

      const preferences = results.matches?.map(m => m.metadata?.text).filter(Boolean) || [];
      return { preferences, contacts: [] };
  } catch (err) {
      console.error("Retrieve error (Index might not exist yet):", err);
      return { preferences: [], contacts: [] };
  }
}
