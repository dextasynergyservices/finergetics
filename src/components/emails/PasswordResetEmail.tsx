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

interface PasswordResetEmailProps {
  name?: string;
  resetUrl: string;
  requestedBy?: string;
}

export function PasswordResetEmail({
  name = "Team Member",
  resetUrl = "https://finergetics.com/admin/reset-password?token=example",
  requestedBy = "An administrator",
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Finergetics Administration Portal password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Bar */}
          <Section style={header}>
            <Heading style={headerTitle}>FINERGETICS</Heading>
            <Text style={headerSubtitle}>
              Strategic Financial &amp; Energy Advisory
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              Hello {name},
            </Heading>
            <Text style={paragraph}>
              <strong>{requestedBy}</strong> has requested a password reset for
              your account on the{" "}
              <strong>Finergetics Administration Portal</strong>.
            </Text>
            <Text style={paragraph}>
              To choose a new secure password and restore access to your
              account, please click the button below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset My Password
              </Button>
            </Section>

            {/* Security Notice Box */}
            <Section style={noticeCard}>
              <Text style={noticeTitle}>Security &amp; Expiry Information</Text>
              <Text style={noticeText}>
                &bull; This link is valid for <strong>2 hours</strong> from the
                time of issuance.
                <br />
                &bull; If you did not request this reset or were not informed by
                your team leadership, you may safely disregard this message.
                Your current password remains unaffected.
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={subtext}>
              If the button above does not work, copy and paste the following
              URL into your browser:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Finergetics Synergy Services
              Limited. All rights reserved.
            </Text>
            <Text style={footerText}>Lagos &bull; London &bull; Houston</Text>
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
  backgroundColor: "#0d2b45", // Navy 950
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
  fontSize: "20px",
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
  margin: "28px 0",
};

const button = {
  backgroundColor: "#1d4ed8", // Royal 600
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const noticeCard = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "24px 0",
};

const noticeTitle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#0d2b45",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 6px",
};

const noticeText = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#4a5568",
  margin: "0",
};

const hr = {
  borderColor: "#edf2f7",
  margin: "28px 0 20px",
};

const subtext = {
  fontSize: "12px",
  color: "#718096",
  margin: "0 0 6px",
};

const urlText = {
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
  margin: "2px 0",
};
