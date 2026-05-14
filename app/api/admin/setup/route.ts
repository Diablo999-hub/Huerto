import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para configurar el administrador" },
        { status: 401 }
      )
    }
    
    // Try to update the profile, if it doesn't exist, use upsert
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        role: "admin",
      }, {
        onConflict: "id"
      })
    
    if (upsertError) {
      console.error("Error updating profile:", upsertError)
      return NextResponse.json(
        { error: "Error al actualizar el perfil: " + upsertError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "¡Felicidades! Ahora eres administrador." 
    })
    
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor: " + String(error) },
      { status: 500 }
    )
  }
}
