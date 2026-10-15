import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InquiryNotificationEmailProps {
  inquiryType: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  interest?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  dashboardUrl?: string;
}

export function InquiryNotificationEmail({
  inquiryType = "Consultation Request",
  name = "Prospective Client",
  email = "client@example.com",
  phone = null,
  company = null,
  interest = null,
  preferredTime = null,
  message = "Inquiry details provided by client.",
  dashboardUrl = "https://finergetics.com/admin/leads",
}: InquiryNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New {inquiryType} from {name} {company ? `(${company})` : ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>FINERGETICS</Heading>
            <Text style={badge}>New Advisory Lead</Text>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              New {inquiryType} Received
            </Heading>
            <Text style={paragraph}>
              A prospective client has submitted an inquiry through the
              Finergetics website. Details are summarized below:
            </Text>

            {/* Details Table Card */}
            <Section style={card}>
              <div style={fieldRow}>
                <span style={fieldLabel}>Client Name:</span>
                <strong style={fieldValue}>{name}</strong>
              </div>

              <div style={fieldRow}>
                <span style={fieldLabel}>Work Email:</span>
                <a href={`mailto:${email}`} style={fieldLink}>
                  {email}
                </a>
              </div>

              {phone && (
                <div style={fieldRow}>
                  <span style={fieldLabel}>Phone:</span>
                  <strong style={fieldValue}>{phone}</strong>
                </div>
              )}

              {company && (
                <div style={fieldRow}>
                  <span style={fieldLabel}>Organization:</span>
                  <strong style={fieldValue}>{company}</strong>
                </div>
              )}

              {interest && (
                <div style={fieldRow}>
                  <span style={fieldLabel}>Practice Area:</span>
                  <strong style={fieldValue}>{interest}</strong>
                </div>
              )}

              {preferredTime && (
                <div style={fieldRow}>
                  <span style={fieldLabel}>Requested Time:</span>
                  <strong style={fieldValue}>{preferredTime}</strong>
                </div>
              )}

              {message && (
                <div style={messageContainer}>
                  <span style={fieldLabel}>Message / Request:</span>
                  <Text style={messageContent}>{message}</Text>
                </div>
              )}
            </Section>

            {/* Action Link */}
            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                View Inquiries in Admin Portal
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={subtext}>
              This is an automated notification from the Finergetics website
              lead capture engine.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Finergetics Advisory Services.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f6f9",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "30px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "580px",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const header = {
  backgroundColor: "#0d2b45", // Royal Navy
  padding: "28px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "800",
  letterSpacing: "3px",
  margin: "0",
};

const badge = {
  backgroundColor: "#1d4ed8",
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  padding: "4px 12px",
  borderRadius: "12px",
  display: "inline-block",
  margin: "10px 0 0",
};

const content = {
  padding: "36px 40px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1a202c",
  margin: "0 0 12px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#4a5568",
  margin: "0 0 20px",
};

const card = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  margin: "0 0 24px",
};

const fieldRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #edf2f7",
  fontSize: "13px",
};

const fieldLabel = {
  color: "#718096",
  fontWeight: "600",
};

const fieldValue = {
  color: "#1a202c",
  textAlign: "right" as const,
};

const fieldLink = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "right" as const,
};

const messageContainer = {
  paddingTop: "12px",
};

const messageContent = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#2d3748",
  margin: "8px 0 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#0d2b45",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#edf2f7",
  margin: "24px 0 16px",
};

const subtext = {
  fontSize: "11px",
  color: "#a0aec0",
  textAlign: "center" as const,
  margin: "0",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "18px 40px",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "11px",
  color: "#a0aec0",
  margin: "0",
};
