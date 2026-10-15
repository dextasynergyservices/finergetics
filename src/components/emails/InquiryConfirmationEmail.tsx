import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InquiryConfirmationEmailProps {
  name: string;
  interest?: string | null;
}

export function InquiryConfirmationEmail({
  name = "Client",
  interest = "Strategic Financial Advisory",
}: InquiryConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting Finergetics Advisory Services</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>FINERGETICS</Heading>
            <Text style={headerSubtitle}>
              Strategic Financial & Energy Advisory
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={greeting}>
              Thank you for contacting us, {name}.
            </Heading>
            <Text style={paragraph}>
              We have received your advisory inquiry regarding{" "}
              <strong>
                {interest || "our strategic consulting practices"}
              </strong>
              .
            </Text>
            <Text style={paragraph}>
              A member of our senior leadership team will review your
              requirements and connect with you within{" "}
              <strong>one business day</strong> to discuss how Finergetics can
              support your objectives.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightHeading}>What happens next?</Text>
              <Text style={highlightItem}>
                1. <strong>Preliminary Review:</strong> Our practice directors
                assess your strategic requirements.
              </Text>
              <Text style={highlightItem}>
                2. <strong>Introductory Call:</strong> We arrange an initial
                discussion to align on scope and milestones.
              </Text>
              <Text style={highlightItem}>
                3. <strong>Tailored Engagement:</strong> We formulate a
                customized advisory framework for your organization.
              </Text>
            </Section>

            <Text style={paragraph}>
              If your inquiry is time-sensitive, you may also reach out directly
              to our executive team at{" "}
              <a href="mailto:info@finergetics.com" style={link}>
                info@finergetics.com
              </a>
              .
            </Text>

            <Hr style={hr} />

            <Text style={signoff}>
              Warm regards,
              <br />
              <strong>The Finergetics Executive Team</strong>
            </Text>
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

const highlightBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "24px 0",
};

const highlightHeading = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#0d2b45",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px",
};

const highlightItem = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#4a5568",
  margin: "6px 0",
};

const link = {
  color: "#1d4ed8",
  fontWeight: "600",
  textDecoration: "none",
};

const hr = {
  borderColor: "#edf2f7",
  margin: "28px 0 20px",
};

const signoff = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#4a5568",
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
