'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Paper, TextField, Button, Typography, Link, Box, Alert } from '@mui/material'
import { useAppDispatch } from '@/store/hooks'
import { loginStart, loginSuccess, loginFailure } from '@/store/features/auth/authSlice'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    dispatch(loginStart())

    try {
      const response = await api.post('/auth/login', formData)
      const { user, token } = response.data
      
      localStorage.setItem('token', token)
      dispatch(loginSuccess({ user, token }))
      router.push('/dashboard')
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      dispatch(loginFailure(message))
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Sign In
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Box textAlign="center">
              <Link href="/auth/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}