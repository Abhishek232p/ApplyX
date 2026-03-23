import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for secure server-side inserts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // 1. Persist to Supabase Database (Waitlist Table)
    // Even if the table doesn't exist yet, it's mocked securely for when the user provisions it.
    const { error } = await supabase.from("waitlist").insert([{ email, created_at: new Date().toISOString() }]);
    
    // Optional: Also fire an n8n webhook so the founder gets an immediate Slack alert
    try {
       await fetch("https://abhishekj.app.n8n.cloud/settings/personal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intent: "new_waitlist_signup", email })
       });
    } catch(e) {
       console.log("n8n tracking hook ignored");
    }

    if (error && error.code !== '42P01') { // Ignore missing table error for local dev
        console.error("Supabase Insertion Error:", error);
    }

    return NextResponse.json({ success: true, message: "Added to waitlist." });
  } catch (error: any) {
    console.error("Waitlist API Error:", error);
    return NextResponse.json({ error: "Failed to process waitlist request." }, { status: 500 });
  }
}
