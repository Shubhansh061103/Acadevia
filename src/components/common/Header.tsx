'use client'

import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/features/auth/authSlice'

export default function Header() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
        {user && (
          <div>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt={user.name}  />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => router.push('/dashboard')}>Dashboard</MenuItem>
              <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}