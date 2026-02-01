import { Container, Title, Text, Stack, Paper } from "@mantine/core";
import Link from "next/link";

export default function TermsPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            Terms and Conditions
          </Title>
          <Text c="dimmed" size="sm">
            Last updated: January 31, 2026
          </Text>
        </div>

        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h3" mb="md">
                1. Acceptance of Terms
              </Title>
              <Text>
                By accessing and using AxilTree ("the Platform"), you accept and
                agree to be bound by the terms and provisions of this agreement.
                If you do not agree to these terms, please do not use the Platform.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                2. Service Description
              </Title>
              <Text>
                AxilTree provides a platform for creating and managing custom link
                pages. We reserve the right to modify, suspend, or discontinue any
                aspect of the service at any time without prior notice.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                3. Premium Features and Pricing
              </Title>
              <Text mb="sm">
                <strong>Important:</strong> The Platform owner reserves the right
                to introduce premium features, themes, and paid tiers at any time.
                This includes, but is not limited to:
              </Text>
              <Text component="ul" ml="md">
                <li>Premium themes and customization options</li>
                <li>Advanced analytics and insights</li>
                <li>Additional link customization features</li>
                <li>Enhanced profile customization</li>
                <li>Priority support services</li>
                <li>Removal of Platform branding</li>
              </Text>
              <Text mt="sm">
                Current free users may be subject to limitations if premium
                features are introduced. We will provide reasonable notice before
                implementing any changes that significantly affect existing users.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                4. User Accounts
              </Title>
              <Text>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized use
                of your account.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                5. Content Ownership and Restrictions
              </Title>
              <Text>
                You retain ownership of all content you post on the Platform.
                However, you grant AxilTree a worldwide, non-exclusive,
                royalty-free license to use, reproduce, and display your content as
                necessary to operate the service. You agree not to post content
                that is illegal, offensive, or infringes on others' rights.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                6. Prohibited Activities
              </Title>
              <Text>You agree not to:</Text>
              <Text component="ul" ml="md">
                <li>Use the Platform for any illegal purposes</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with or disrupt the service</li>
                <li>Impersonate others or provide false information</li>
                <li>Scrape, harvest, or collect user data</li>
                <li>
                  Use automated systems or bots to access the Platform without
                  permission
                </li>
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                7. Termination
              </Title>
              <Text>
                We reserve the right to terminate or suspend your account at any
                time, without notice, for conduct that we believe violates these
                Terms and Conditions or is harmful to other users, us, or third
                parties.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                8. Disclaimer of Warranties
              </Title>
              <Text>
                The Platform is provided "as is" without warranties of any kind,
                either express or implied. We do not guarantee that the service
                will be uninterrupted, secure, or error-free.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                9. Limitation of Liability
              </Title>
              <Text>
                AxilTree shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use or
                inability to use the Platform.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                10. Changes to Terms
              </Title>
              <Text>
                We reserve the right to modify these Terms and Conditions at any
                time. Changes will be effective immediately upon posting to the
                Platform. Your continued use of the Platform after changes are
                posted constitutes acceptance of the modified terms.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                11. Governing Law
              </Title>
              <Text>
                These Terms and Conditions shall be governed by and construed in
                accordance with applicable laws, without regard to conflict of law
                provisions.
              </Text>
            </div>

            <div>
              <Title order={2} size="h3" mb="md">
                12. Contact Information
              </Title>
              <Text>
                If you have any questions about these Terms and Conditions, please
                contact us through the Platform.
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
