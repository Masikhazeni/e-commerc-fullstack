import { useTheme } from '@emotion/react'
import { Box, TextField, Typography } from '@mui/material'
import React from 'react'

export default function EditField({ label, name, value, onChange, sx }) {
    const theme=useTheme()
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 1,
        backgroundColor: theme.palette.background.default,
        ...sx,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
        {label}
      </Typography>
      <TextField
        name={name}
        value={value || ""}
        onChange={onChange}
        variant="standard"
        fullWidth
        sx={{
          maxWidth: "70%",
          "& .MuiInputBase-input": {
            textAlign: "left",
            color: theme.palette.text.secondary,
          },
        }}
      />
    </Box>
  )
}
