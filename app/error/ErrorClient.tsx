"use client";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Center,
  Paper,
} from "@mantine/core";
import { CircleAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") || "Something went wrong. Please try again.";

  return (
    <Center h="100vh" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fafafa, #ffffff)' }}>
      <Container size="sm">
        <Paper shadow="lg" p="xl" radius="md" withBorder>
          <Stack align="center" gap="lg">
            {/* Large Alert Icon */}
            <div className="text-red-600">
              <CircleAlert size={80} strokeWidth={1.5} />
            </div>

            <Title order={1} ta="center" c="red.7">
              Oops! An Error Occurred
            </Title>

            <Alert
              icon={<CircleAlert size={24} />}
              title="Error Details"
              color="red"
              radius="md"
              variant="light"
              w="100%"
            >
              <Text size="md" ta="center">
                {message}
              </Text>
            </Alert>

            <Text size="lg" c="dimmed" ta="center">
              We're working to fix this issue as quickly as possible.
            </Text>

            <Stack  gap="md" mt="md">
              <Button
                component={Link}
                href="/"
                
                leftSection={<Home size={18} />}
                variant="gradient"
                color="blue"
                size="md"
              >
                Back to Home
              </Button>

              <Button
                component={Link}
                href="/signup"
                leftSection={<ArrowLeft size={18} />}
                variant="outline"
                color="gray"
                size="md"
              >
                Try Signup Again
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}