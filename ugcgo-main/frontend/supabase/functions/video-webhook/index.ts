import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Webhook received ===')
    console.log('Method:', req.method)
    console.log('Headers:', Object.fromEntries(req.headers.entries()))

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body as text
    const bodyText = await req.text()
    console.log('Raw body:', bodyText)

    // Check if body is empty
    if (!bodyText || bodyText.trim() === '') {
      console.error('Empty request body')
      return new Response(
        JSON.stringify({ error: 'Empty request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let videoUrl = ''

    // N8n sends the URL directly as a quoted string in the body
    // Remove quotes if present
    videoUrl = bodyText.trim()
    if (videoUrl.startsWith('"') && videoUrl.endsWith('"')) {
      videoUrl = videoUrl.slice(1, -1)
    }
    
    console.log('Extracted video URL:', videoUrl)

    // Validate URL format
    if (!videoUrl || !videoUrl.startsWith('http')) {
      console.error('Invalid video URL format:', videoUrl)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid video URL format',
          receivedUrl: videoUrl,
          receivedBody: bodyText
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate video details
    const videoName = `AI Generated Video - ${new Date().toLocaleDateString('tr-TR')}`
    const description = 'AI ile oluşturulan video içeriği'
    const duration = '15s'
    
    // Get the first available user from the database
    const { data: users, error: userError } = await supabaseClient
      .from('users')
      .select('id, email')
      .order('created_at', { ascending: false })

    if (userError || !users || users.length === 0) {
      console.error('No users found in database:', userError)
      return new Response(
        JSON.stringify({ 
          error: 'No users found in database. Please create a user account first.',
          details: userError?.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use the most recently created user (likely the active one)
    const userId = users[0].id

    console.log('Creating video record with:', {
      name: videoName,
      video_url: videoUrl,
      user_id: userId
    })

    // Insert video record into database
    const { data: videoRecord, error } = await supabaseClient
      .from('videos')
      .insert({
        name: videoName,
        description: description,
        status: 'completed',
        duration: duration,
        views: 0,
        product_name: 'AI Generated Content',
        selected_style: 'modern',
        selected_voice: 'ai-voice',
        script_content: description,
        video_url: videoUrl,
        user_id: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save video record', 
          details: error.message,
          code: error.code 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Video record created successfully:', videoRecord.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processed and saved successfully',
        videoId: videoRecord.id,
        videoUrl: videoUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})