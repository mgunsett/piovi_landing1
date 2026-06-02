import { useEffect, useRef, useState } from 'react'
import {
  Box, Flex, Text, Input, Button, VStack, HStack, Image,
  Spinner, useToast, Divider,
} from '@chakra-ui/react'
import { supabase, isSupabaseConfigured, SHIELDS_BUCKET } from '../lib/supabase'
import { rowToMatch, defaultMatches } from '../data/matchData'

// ─── ADMIN PAGE ──────────────────────────────────────────────────
// Panel para administrar "Último Resultado" y "Próximo Partido".
// Login real con Supabase Auth · datos en tabla `matches` · escudos
// en Supabase Storage (bucket `shields`).

const EMPTY = {
  home: { name: '', shield: '' },
  away: { name: '', shield: '' },
  homeScore: '',
  awayScore: '',
  date: '',
  stadium: '',
  competition: '',
}

const PAGE_BG = '#080C12'

// ─── Estilos compartidos de inputs ───────────────────────────────
const inputStyle = {
  bg: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 0,
  color: 'white',
  fontFamily: "'Barlow', sans-serif",
  fontSize: '14px',
  _placeholder: { color: 'whiteAlpha.400' },
  _hover: { borderColor: 'rgba(0,87,184,0.5)' },
  _focus: { borderColor: 'brand.blue', boxShadow: 'none' },
}

function FieldLabel({ children }) {
  return (
    <Text
      fontFamily="'Barlow Condensed', sans-serif"
      fontSize="11px"
      fontWeight="700"
      letterSpacing="0.18em"
      textTransform="uppercase"
      color="whiteAlpha.600"
      mb={1.5}
    >
      {children}
    </Text>
  )
}

// ─── Subida de escudo a Storage ──────────────────────────────────
function ShieldUpload({ value, onChange, slot, side }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${slot}-${side}-${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from(SHIELDS_BUCKET)
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (error) throw error
      const { data } = supabase.storage.from(SHIELDS_BUCKET).getPublicUrl(path)
      onChange(data.publicUrl)
      toast({ title: 'Escudo subido', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: 'Error al subir', description: err.message, status: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <VStack spacing={2} align="center">
      <Box
        w="64px"
        h="64px"
        border="1px solid rgba(255,255,255,0.12)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(255,255,255,0.02)"
      >
        {uploading ? (
          <Spinner size="sm" color="brand.blue" />
        ) : value ? (
          <Image src={value} alt="escudo" boxSize="52px" objectFit="contain" />
        ) : (
          <Text fontSize="10px" color="whiteAlpha.400" textAlign="center">
            Sin{'\n'}escudo
          </Text>
        )}
      </Box>
      <Button
        size="xs"
        variant="outline"
        borderRadius={0}
        borderColor="rgba(0,87,184,0.5)"
        color="white"
        fontFamily="'Barlow Condensed', sans-serif"
        letterSpacing="0.1em"
        textTransform="uppercase"
        fontWeight="600"
        _hover={{ bg: 'rgba(0,87,184,0.2)' }}
        onClick={() => fileRef.current?.click()}
        isLoading={uploading}
      >
        Subir
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </VStack>
  )
}

// ─── Formulario de un partido ────────────────────────────────────
function MatchForm({ slot, title, accent, showScore, initial }) {
  const [form, setForm] = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  const set = (path, val) => {
    setForm((f) => {
      if (path === 'home.name') return { ...f, home: { ...f.home, name: val } }
      if (path === 'home.shield') return { ...f, home: { ...f.home, shield: val } }
      if (path === 'away.name') return { ...f, away: { ...f.away, name: val } }
      if (path === 'away.shield') return { ...f, away: { ...f.away, shield: val } }
      return { ...f, [path]: val }
    })
  }

  const toIntOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null
    const n = parseInt(v, 10)
    return Number.isNaN(n) ? null : n
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        slot,
        home_team: form.home.name,
        home_shield: form.home.shield,
        away_team: form.away.name,
        away_shield: form.away.shield,
        home_score: showScore ? toIntOrNull(form.homeScore) : null,
        away_score: showScore ? toIntOrNull(form.awayScore) : null,
        match_date: form.date,
        stadium: form.stadium,
        competition: form.competition,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase
        .from('matches')
        .upsert(payload, { onConflict: 'slot' })
      if (error) throw error
      toast({ title: 'Guardado', status: 'success', duration: 2000 })
    } catch (err) {
      toast({ title: 'Error al guardar', description: err.message, status: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('matches').delete().eq('slot', slot)
      if (error) throw error
      setForm(EMPTY)
      toast({ title: 'Datos eliminados', status: 'info', duration: 2000 })
    } catch (err) {
      toast({ title: 'Error al eliminar', description: err.message, status: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box
      flex="1"
      minW={{ base: '100%', md: '340px' }}
      bg="rgba(255,255,255,0.015)"
      border="1px solid rgba(255,255,255,0.08)"
      p={6}
      position="relative"
      sx={{
        '&::before': {
          content: '""', position: 'absolute', top: 0, left: 0,
          width: '32px', height: '3px', background: accent,
        },
      }}
    >
      <Text
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="24px"
        letterSpacing="0.04em"
        color="white"
        mb={5}
      >
        {title}
      </Text>

      {/* Equipos + escudos */}
      <Flex gap={4} mb={5}>
        <VStack flex="1" spacing={3} align="stretch">
          <Box>
            <FieldLabel>Equipo Local</FieldLabel>
            <Input
              {...inputStyle}
              value={form.home.name}
              onChange={(e) => set('home.name', e.target.value)}
              placeholder="Ej: Cruz Azul"
            />
          </Box>
          <ShieldUpload
            value={form.home.shield}
            onChange={(url) => set('home.shield', url)}
            slot={slot}
            side="home"
          />
        </VStack>

        <VStack flex="1" spacing={3} align="stretch">
          <Box>
            <FieldLabel>Equipo Visitante</FieldLabel>
            <Input
              {...inputStyle}
              value={form.away.name}
              onChange={(e) => set('away.name', e.target.value)}
              placeholder="Ej: América"
            />
          </Box>
          <ShieldUpload
            value={form.away.shield}
            onChange={(url) => set('away.shield', url)}
            slot={slot}
            side="away"
          />
        </VStack>
      </Flex>

      {/* Resultado (solo último partido) */}
      {showScore && (
        <HStack spacing={4} mb={5}>
          <Box flex="1">
            <FieldLabel>Goles Local</FieldLabel>
            <Input
              {...inputStyle}
              type="number"
              value={form.homeScore ?? ''}
              onChange={(e) => set('homeScore', e.target.value)}
              placeholder="0"
            />
          </Box>
          <Box flex="1">
            <FieldLabel>Goles Visitante</FieldLabel>
            <Input
              {...inputStyle}
              type="number"
              value={form.awayScore ?? ''}
              onChange={(e) => set('awayScore', e.target.value)}
              placeholder="0"
            />
          </Box>
        </HStack>
      )}

      <VStack spacing={4} align="stretch" mb={6}>
        <Box>
          <FieldLabel>Fecha</FieldLabel>
          <Input
            {...inputStyle}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            placeholder="Ej: 19 Mar 2026"
          />
        </Box>
        <Box>
          <FieldLabel>Estadio</FieldLabel>
          <Input
            {...inputStyle}
            value={form.stadium}
            onChange={(e) => set('stadium', e.target.value)}
            placeholder="Ej: Estadio Azteca"
          />
        </Box>
        <Box>
          <FieldLabel>Competición (opcional)</FieldLabel>
          <Input
            {...inputStyle}
            value={form.competition}
            onChange={(e) => set('competition', e.target.value)}
            placeholder="Ej: Liga MX · J12"
          />
        </Box>
      </VStack>

      <HStack spacing={3}>
        <Button
          flex="1"
          bg="brand.blue"
          color="white"
          borderRadius={0}
          fontFamily="'Barlow Condensed', sans-serif"
          letterSpacing="0.12em"
          textTransform="uppercase"
          fontWeight="700"
          _hover={{ bg: '#003A7D' }}
          onClick={handleSave}
          isLoading={saving}
        >
          Guardar
        </Button>
        <Button
          variant="outline"
          borderRadius={0}
          borderColor="rgba(255,80,80,0.4)"
          color="rgba(255,120,120,0.9)"
          fontFamily="'Barlow Condensed', sans-serif"
          letterSpacing="0.12em"
          textTransform="uppercase"
          fontWeight="600"
          _hover={{ bg: 'rgba(255,80,80,0.12)' }}
          onClick={handleDelete}
          isLoading={deleting}
        >
          Eliminar
        </Button>
      </HStack>
    </Box>
  )
}

// ─── Login ───────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else onLogin()
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg={PAGE_BG} px={4}>
      <Box
        as="form"
        onSubmit={submit}
        w="100%"
        maxW="380px"
        bg="rgba(255,255,255,0.015)"
        border="1px solid rgba(255,255,255,0.08)"
        p={8}
        position="relative"
        sx={{
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0,
            width: '40px', height: '3px', background: '#0057B8',
          },
        }}
      >
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="34px"
          color="white"
          letterSpacing="0.04em"
          lineHeight="1"
        >
          ADMIN
          <Box as="span" color="brand.blue">_</Box>
        </Text>
        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="12px"
          letterSpacing="0.16em"
          textTransform="uppercase"
          color="whiteAlpha.500"
          mb={7}
        >
          Panel de partidos · Piovi
        </Text>

        <VStack spacing={4} align="stretch">
          <Box>
            <FieldLabel>Usuario (email)</FieldLabel>
            <Input
              {...inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="username"
            />
          </Box>
          <Box>
            <FieldLabel>Contraseña</FieldLabel>
            <Input
              {...inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Box>

          {error && (
            <Text fontSize="13px" color="rgba(255,120,120,0.9)" fontFamily="'Barlow', sans-serif">
              {error}
            </Text>
          )}

          <Button
            type="submit"
            bg="brand.blue"
            color="white"
            borderRadius={0}
            fontFamily="'Barlow Condensed', sans-serif"
            letterSpacing="0.14em"
            textTransform="uppercase"
            fontWeight="700"
            mt={2}
            _hover={{ bg: '#003A7D' }}
            isLoading={loading}
          >
            Ingresar
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}

// ─── Aviso de configuración faltante ─────────────────────────────
function NotConfigured() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg={PAGE_BG} px={4}>
      <Box maxW="520px" textAlign="center">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="40px" color="white">
          Falta configurar Supabase
        </Text>
        <Text fontFamily="'Barlow', sans-serif" color="whiteAlpha.700" mt={3} lineHeight="1.7">
          Creá un archivo <Box as="code" color="brand.blue">.env</Box> en la raíz con
          {' '}<Box as="code" color="brand.blue">VITE_SUPABASE_URL</Box> y
          {' '}<Box as="code" color="brand.blue">VITE_SUPABASE_ANON_KEY</Box>, luego reiniciá el
          servidor de desarrollo. Mirá <Box as="code" color="brand.blue">SUPABASE_SETUP.md</Box>.
        </Text>
      </Box>
    </Flex>
  )
}

// ─── Página principal ────────────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [initial, setInitial] = useState(null) // { last, next } desde DB

  // Sesión
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Cargar datos existentes al autenticarse
  useEffect(() => {
    if (!session) return
    ;(async () => {
      const { data } = await supabase.from('matches').select('*').in('slot', ['last', 'next'])
      const lastRow = data?.find((r) => r.slot === 'last')
      const nextRow = data?.find((r) => r.slot === 'next')
      setInitial({
        last: toForm(rowToMatch(lastRow)),
        next: toForm(rowToMatch(nextRow)),
      })
    })()
  }, [session])

  if (!isSupabaseConfigured) return <NotConfigured />

  if (checking) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={PAGE_BG}>
        <Spinner color="brand.blue" />
      </Flex>
    )
  }

  if (!session) return <LoginForm onLogin={() => {}} />

  return (
    <Box minH="100vh" bg={PAGE_BG} color="white">
      <Box maxW="900px" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 8, md: 12 }}>
        {/* Header */}
        <Flex align="center" justify="space-between" mb={2} wrap="wrap" gap={3}>
          <Box>
            <Text fontFamily="'Bebas Neue', sans-serif" fontSize="40px" lineHeight="1" letterSpacing="0.03em">
              PANEL DE PARTIDOS
            </Text>
            <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="12px" letterSpacing="0.16em" textTransform="uppercase" color="whiteAlpha.500">
              {session.user?.email}
            </Text>
          </Box>
          <HStack spacing={3}>
            <Button as="a" href="/" variant="outline" borderRadius={0} borderColor="rgba(255,255,255,0.15)" color="white" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.1em" textTransform="uppercase" fontWeight="600" _hover={{ bg: 'rgba(255,255,255,0.06)' }}>
              Ver web
            </Button>
            <Button variant="outline" borderRadius={0} borderColor="rgba(0,87,184,0.5)" color="white" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.1em" textTransform="uppercase" fontWeight="600" _hover={{ bg: 'rgba(0,87,184,0.2)' }} onClick={() => supabase.auth.signOut()}>
              Salir
            </Button>
          </HStack>
        </Flex>

        <Divider borderColor="rgba(255,255,255,0.08)" my={6} />

        {!initial ? (
          <Flex justify="center" py={12}><Spinner color="brand.blue" /></Flex>
        ) : (
          <Flex gap={6} direction={{ base: 'column', md: 'row' }} align="stretch">
            <MatchForm slot="last" title="Último Resultado" accent="#C9A84C" showScore initial={initial.last} />
            <MatchForm slot="next" title="Próximo Partido" accent="#0057B8" showScore={false} initial={initial.next} />
          </Flex>
        )}
      </Box>
    </Box>
  )
}

// Convierte un match (rowToMatch) al shape del formulario.
function toForm(match) {
  if (!match) return EMPTY
  return {
    home: { name: match.home.name, shield: match.home.shield },
    away: { name: match.away.name, shield: match.away.shield },
    homeScore: match.homeScore ?? '',
    awayScore: match.awayScore ?? '',
    date: match.date,
    stadium: match.stadium,
    competition: match.competition,
  }
}
