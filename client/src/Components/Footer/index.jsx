import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const footerSections = [
  {
    title: "درباره ما",
    links: ["تماس با ما", "درباره فروشگاه", "همکاری با ما"],
  },
  {
    title: "راهنمای خرید",
    links: ["سؤالات متداول", "پیگیری سفارش", "قوانین سایت"],
  },
  {
    title: "خدمات مشتری",
    links: ["پشتیبانی", "ضمانت بازگشت", "شیوه ارسال"],
  },
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        py: 4,
        direction: "rtl",
        
      }}
    >
      <Container maxWidth="lg">
        {isMobile ? (
          footerSections.map((section, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: "transparent",
                color: "white",
                boxShadow: "none",
                "&::before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              >
                <Typography fontWeight="bold">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.links.map((link, i) => (
                  <Typography
                    key={i}
                    sx={{ mb: 1, fontSize: "14px", textAlign: "right" }}
                  >
                    <Link href="#" underline="hover" color="inherit">
                      {link}
                    </Link>
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 6,
              textAlign: "center",
            }}
          >
            {footerSections.map((section, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: "180px",
                  flex: "1 1 200px",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "white" }}
                >
                  {section.title}
                </Typography>
                {section.links.map((link, i) => (
                  <Typography
                    key={i}
                    sx={{ mb: 1, fontSize: "14px", color: "white" }}
                  >
                    <Link href="#" underline="hover" color="inherit">
                      {link}
                    </Link>
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {/* Divider + Copyright */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            mt: 4,
            pt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="inherit" textAlign="center">
            © {new Date().getFullYear()} تمامی حقوق برای فروشگاه محفوظ است.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}


