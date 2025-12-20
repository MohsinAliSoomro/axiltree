// app/verify-email/page.tsx
"use client";

import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Alert,
  Button,
  Center,
} from "@mantine/core";
import { MailCheck, Inbox, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <Center h="100vh" bg="gray.0">
      <Container size="sm">
        <Paper shadow="lg" p="xl" radius="md" withBorder >
          <Stack align="center" gap="lg">
            {/* Success Icon */}
              <MailCheck size={80} strokeWidth={1.5} />

            <Title order={1} ta="center" c="grape">
              Check Your Email
            </Title>

            <Text size="lg" c="dimmed" ta="center">
              We've sent a verification link to your email address.
            </Text>

            <Text size="md" ta="center" c="dimmed">
              Please check your inbox (and spam/junk folder) and click the link
              to verify your account.
            </Text>

            <Alert
              icon={<Inbox size={20} />}
              title="Didn't receive the email?"
              color="grape"
              variant="light"
              radius="md"
              w="100%"
            >
              <Text size="sm">
                • Wait a few minutes and check spam/junk folder
                <br />
                • Make sure you entered the correct email address
                <br />• You can try resending the verification email
              </Text>
            </Alert>

            <Stack gap="md" mt="md">
              {/* Optional: Resend button (you can connect to a server action later) */}
              <Button
                leftSection={<RefreshCw size={18} />}
                variant="gradient"
                color="blue"
              >
                Resend Verification Email
              </Button>

              <Button
                component={Link}
                href="/"
                leftSection={<ArrowLeft size={18} />}
                variant="filled"
                color="grape.4"
              >
                Back to Home
              </Button>
            </Stack>

            {/* Alternative: Use your CustomButton */}
            <Button
              leftSection={<RefreshCw size={18} />}
              variant="outline"
              color="grape"
            >
              Resend Verification Email
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
