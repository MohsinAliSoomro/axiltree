import { Container, Title, Text, Stack, Paper } from "@mantine/core";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            Privacy Policy
          </Title>
          <Text c="dimmed" size="sm">
            Last updated: March 3, 2026
          </Text>
        </div>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">
                1. Data We Collect (Minimum)
              </Title>
              <Text>
                We collect only the data needed to run AxilTree: account details
                (such as email and username), profile content you create (links,
                bio, themes), and basic technical logs required for security and
                reliability.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                2. How We Use Data
              </Title>
              <Text>
                We use your data to provide the service, secure accounts,
                troubleshoot issues, and improve platform performance.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                3. Data Sharing
              </Title>
              <Text>
                We do not sell your personal data. We may share limited data with
                trusted service providers only when necessary to operate AxilTree
                (for example hosting, authentication, and analytics).
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                4. Data Retention
              </Title>
              <Text>
                We keep your data while your account is active, or as required for
                legal, security, and fraud-prevention purposes.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                5. Your Rights
              </Title>
              <Text>
                You can request account data access, correction, or deletion
                through the Platform support/contact channel.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                6. Changes to This Policy
              </Title>
              <Text>
                We may update this Privacy Policy from time to time. Updates are
                effective when posted on this page.
              </Text>
            </div>
          </Stack>
        </Paper>

        <Text ta="center" c="dimmed" size="sm">
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            ← Back to Home
          </Link>
        </Text>
      </Stack>
    </Container>
  );
}
