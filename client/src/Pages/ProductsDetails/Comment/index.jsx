// import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material'
// import React from 'react'

// export default function Comment({ username, content, date, reply }) {
//   const theme = useTheme()

//   const getFirstLetter = (name) => {
//     if (!name) return "؟"
//     const trimmed = name.trim()
//     const match = trimmed.match(/[\p{L}]/u)
//     return match ? match[0].toUpperCase() : "؟"
//   }

//   return (
//     <Box
//       sx={{
//         width: { xs: "90%", sm: "300px", md: "250px" },
//         height:'240px',
//         p: { xs: 2, sm: 2.5, md: 3 },
//         borderRadius: 4,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.box})`,
//         boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
//         transition: "all 0.3s ease-in-out",
//         "&:hover": {
//           boxShadow: `0px 8px 15px ${theme.palette.primary.light}`,
//         },
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//         <Avatar
//           sx={{
//             width: 30,
//             height: 30,
//             bgcolor: theme.palette.text.primary,
//             color: theme.palette.primary.main,
//             ml: "5px",
//             fontSize: 13,
//           }}
//         >
//           {getFirstLetter(username)}
//         </Avatar>
//         <Typography
//           variant="subtitle2"
//           fontWeight="bold"
//           sx={{
//             fontSize: { xs: "13px", sm: "14px" },
//             color: theme.palette.primary.dark,
//           }}
//         >
//           {username || "بی‌نام"}
//         </Typography>
//       </Box>

//       {/* Content */}
//       <Box sx={{ flexGrow: 1, p: 1, overflowWrap: 'break-word' }}>
//         <Typography
//           variant="body2"
//           sx={{
//             fontSize: { xs: "14px", sm: "15px" },
//             color: theme.palette.text.primary,
//             lineHeight: 1.7,
//             whiteSpace: 'pre-wrap',
//             wordBreak: 'break-word',
//           }}
//         >
//           {content}
//         </Typography>

//         {/* Reply */}
//         {reply && (
//           <Box
//             sx={{
//               mt: 1.5,
//               p: 1.2,
//               borderRadius: 2,
//               backgroundColor: theme.palette.background.default,
//               border: `1px solid ${theme.palette.divider}`,
//               boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{
//                 fontWeight: 'bold',
//                 color: theme.palette.primary.main,
//                 display: 'block',
//                 mb: 0.5,
//               }}
//             >
//               پاسخ ادمین:
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 fontSize: "13px",
//                 color: theme.palette.text.secondary,
//                 lineHeight: 1.6,
//                 whiteSpace: 'pre-wrap',
//                 wordBreak: 'break-word',
//               }}
//             >
//               {reply}
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       {/* Footer */}
//       <Box sx={{ textAlign: "center", mt: 2 }}>
//         <Divider />
//         <Typography
//           variant="caption"
//           sx={{
//             fontSize: { xs: "11px", sm: "12px" },
//             color: theme.palette.text.secondary,
//             mt: '8px',
//           }}
//         >
//           {new Date(date).toLocaleDateString("fa-IR", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </Typography>
//       </Box>
//     </Box>
//   )
// }



import { Avatar, Box, Divider, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Comment({ username, content, date, reply, isActive }) {
  const theme = useTheme()
  const { user } = useSelector((state) => state.auth)

  // اگر نظر غیرفعال است، چیزی نمایش نده
  if (isActive === false) return null

  const getFirstLetter = (name) => {
    const displayName = name || user?.username
    if (!displayName) return "؟"
    const trimmed = displayName.trim()
    const match = trimmed.match(/[\p{L}]/u)
    return match ? match[0].toUpperCase() : "؟"
  }

  const getDisplayName = () => {
    if (username) return username
    if (user?.username) return user.username
    return "کاربر سایت"
  }

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "300px", md: "250px" },
        height: '240px',
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.box})`,
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: `0px 8px 15px ${theme.palette.primary.light}`,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: theme.palette.text.primary,
            color: theme.palette.primary.main,
            ml: "5px",
            fontSize: 13,
          }}
        >
          {getFirstLetter(username)}
        </Avatar>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "13px", sm: "14px" },
            color: theme.palette.primary.dark,
          }}
        >
          {getDisplayName()}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 1, overflowWrap: 'break-word' }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "14px", sm: "15px" },
            color: theme.palette.text.primary,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </Typography>

        {/* Reply */}
        {reply && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                display: 'block',
                mb: 0.5,
              }}
            >
              پاسخ ادمین:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "13px",
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {reply}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Divider />
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: "11px", sm: "12px" },
            color: theme.palette.text.secondary,
            mt: '8px',
          }}
        >
          {new Date(date).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>
    </Box>
  )
}