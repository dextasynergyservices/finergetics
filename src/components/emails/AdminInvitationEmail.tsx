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

interface AdminInvitationEmailProps {
  name: string;
  invitedBy: string;
  role: string;
  acceptUrl: string;
}

export function AdminInvitationEmail({
  name = "Team Member",
  invitedBy = "An administrator",
  role = "Editor",
  acceptUrl = "https://finergetics.com/admin/accept-invitation?token=example",
}: AdminInvitationEmailProps) {
  const roleDisplay =
    role.toLowerCase() === "admin" ? "Administrator" : "Editor";

  return (
    <Html>
      <Head />
      <Preview>You have been invited to join the Finergetics team</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Bar */}
          <Section style={header}>
            <Heading style={headerTitle}>FINERGETICS</Heading>
            <Text style={headerSubtitle}>
              Strategic Financial & Energy Advisory
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              Hello {name},
            </Heading>
            <Text style={paragraph}>
              <strong>{invitedBy}</strong> has invited you to join the{" "}
              <strong>Finergetics Administration Portal</strong> as an{" "}
              <strong>{roleDisplay}</strong>.
            </Text>
            <Text style={paragraph}>
              As an authorized team member, you will have access to manage
              advisory practice offerings, thought leadership publications,
              client case studies, and website content.
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={acceptUrl}>
                Accept Invitation &amp; Set Password
              </Button>
            </Section>

            <Text style={securityNotice}>
              This invitation link is strictly confidential and will expire in{" "}
              <strong>48 hours</strong>.
            </Text>

            <Hr style={hr} />

            <Text style={subtext}>
              If the button above does not work, copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>{acceptUrl}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Finergetics Advisory Services.
              All rights reserved.
            </Text>
            <Text style={footerText}>
              If you were not expecting this invitation, you can safely ignore
              this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles for broad email client compatibility (Outlook, Gmail, Apple Mail)
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
  padding: "32px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "3px",
  margin: "0",
};

const headerSubtitle = {
  color: "#90caf9",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: "6px 0 0",
};

const content = {
  padding: "40px",
};

const greeting = {
  fontSize: "19px",
  fontWeight: "700",
  color: "#1a202c",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#4a5568",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1d4ed8", // Royal Blue
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  boxShadow: "0 2px 4px rgba(29, 78, 216, 0.2)",
};

const securityNotice = {
  fontSize: "12px",
  color: "#718096",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "10px 14px",
  margin: "24px 0",
};

const hr = {
  borderColor: "#edf2f7",
  margin: "28px 0 20px",
};

const subtext = {
  fontSize: "11px",
  color: "#a0aec0",
  margin: "0 0 6px",
};

const linkText = {
  fontSize: "11px",
  color: "#2563eb",
  wordBreak: "break-all" as const,
  margin: "0",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px 40px",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "11px",
  color: "#a0aec0",
  lineHeight: "16px",
  margin: "2px 0",
};
