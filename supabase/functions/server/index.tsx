import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-63111a90/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-63111a90/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured for verification
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: data.user,
      message: "Account created successfully" 
    });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Send email notification endpoint
app.post("/make-server-63111a90/send-notification", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { type, application } = await c.req.json();
    
    // Get RESEND API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured. Email notification skipped.");
      return c.json({ 
        success: false, 
        message: "Email service not configured" 
      });
    }

    // Prepare email content based on notification type
    let subject = "";
    let htmlContent = "";
    
    switch (type) {
      case "added":
        subject = `New Application Added: ${application.position} at ${application.company}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">✨ New Job Application Added</h2>
            <div style="background: linear-gradient(to right, #fce7f3, #fae8ff); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Position:</strong> ${application.position}</p>
              <p><strong>Company:</strong> ${application.company}</p>
              <p><strong>Status:</strong> ${application.status}</p>
              <p><strong>Location:</strong> ${application.location}</p>
              <p><strong>Applied Date:</strong> ${application.appliedDate}</p>
              ${application.notes ? `<p><strong>Notes:</strong> ${application.notes}</p>` : ''}
            </div>
            <p style="color: #9333ea;">Keep tracking your applications! 💼</p>
          </div>
        `;
        break;
      case "updated":
        subject = `Application Updated: ${application.position} at ${application.company}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">📝 Job Application Updated</h2>
            <div style="background: linear-gradient(to right, #fce7f3, #fae8ff); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Position:</strong> ${application.position}</p>
              <p><strong>Company:</strong> ${application.company}</p>
              <p><strong>Status:</strong> ${application.status}</p>
              <p><strong>Location:</strong> ${application.location}</p>
              <p><strong>Applied Date:</strong> ${application.appliedDate}</p>
              ${application.notes ? `<p><strong>Notes:</strong> ${application.notes}</p>` : ''}
            </div>
            <p style="color: #9333ea;">Stay on top of your job search! 🌟</p>
          </div>
        `;
        break;
      case "deleted":
        subject = `Application Removed: ${application.position} at ${application.company}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">🗑️ Job Application Removed</h2>
            <div style="background: linear-gradient(to right, #fce7f3, #fae8ff); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p>You've removed the application for:</p>
              <p><strong>${application.position}</strong> at <strong>${application.company}</strong></p>
            </div>
            <p style="color: #9333ea;">Keep organizing your applications! 📋</p>
          </div>
        `;
        break;
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Job Tracker <onboarding@resend.dev>',
        to: [user.email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log(`Email sending error: ${JSON.stringify(result)}`);
      return c.json({ 
        success: false, 
        error: result.message || "Failed to send email" 
      }, 400);
    }

    console.log(`Email notification sent successfully to ${user.email}`);
    return c.json({ 
      success: true, 
      message: "Email notification sent successfully" 
    });

  } catch (error) {
    console.log(`Error sending notification: ${error}`);
    return c.json({ error: "Failed to send notification" }, 500);
  }
});

Deno.serve(app.fetch);