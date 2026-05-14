import { NextRequest, NextResponse } from 'next/server'

// Mock verification endpoint (simulated). Returns a deterministic mock
// response based on cedula format. This avoids scraping and external
// dependencies while preserving the UI flow.

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cedula = (body?.cedula || '').toString().trim()
    if (!cedula) return NextResponse.json({ ok: false, error: 'missing_cedula' }, { status: 400 })

    const cedulaClean = cedula.replace(/\D/g, '')
    const isValidFormat = /^[1-9]\d{6,9}$/.test(cedulaClean)

    // Simulate processing time
    await new Promise((r) => setTimeout(r, 800))

    if (isValidFormat) {
      return NextResponse.json({
        ok: true,
        verified: true,
        data: {
          cedula: cedulaClean,
          nombre: 'Profesional Verificado (simulado)',
          titulo: 'Licenciatura en Ciencias de la Salud (simulado)',
          institucion: 'Universidad Nacional Simulada',
          fecha_expedicion: '2020-01-15',
          estatus: 'Vigente',
          especialidad: 'Nutrición y huertos urbanos (simulado)',
        },
      })
    }

    return NextResponse.json({ ok: true, verified: false, message: 'No se encontró información para esta cédula (simulado)' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cedula = searchParams.get('cedula')

  if (!cedula) {
    return NextResponse.json({ verified: false, message: 'Número de cédula requerido' }, { status: 400 })
  }

  const cedulaClean = cedula.replace(/\D/g, '')
  const isValidFormat = /^[1-9]\d{6,9}$/.test(cedulaClean)

  await new Promise((r) => setTimeout(r, 400))

  if (isValidFormat) {
    return NextResponse.json({
      verified: true,
      data: {
        cedula: cedulaClean,
        nombre: 'Profesional Verificado (simulado)',
        titulo: 'Licenciatura en Ciencias de la Salud (simulado)',
        institucion: 'Universidad Nacional Simulada',
        fecha_expedicion: '2020-01-15',
        estatus: 'Vigente',
        especialidad: 'Nutrición y huertos urbanos (simulado)',
      },
      message: 'Cédula verificada (simulado)'
    })
  }

  return NextResponse.json({ verified: false, message: 'No se encontró información para esta cédula (simulado)' })
}
