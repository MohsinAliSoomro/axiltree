"use client";

import { signup } from "./actions";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Center,
} from "@mantine/core";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Signup() {

  return (
    <Center h="100vh" bg="gray.0">
      <Container size="xs">
        <Paper shadow="lg" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div className="text-center">
              <Title order={2} ta="center">
                Welcome Back
              </Title>
              <Text size="sm" c="dimmed" ta="center" mt={5}>
                Log in to your account or create a new one
              </Text>
            </div>

            <form>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  required
                  leftSection={<Mail size={18} />}
                  size="md"
                />

                <PasswordInput
                  label="Password"
                  placeholder="Your secure password"
                  name="password"
                  required
                  leftSection={<Lock size={18} />}
                  size="md"
                />

                <Button
                  formAction={signup}
                  type="submit"
                  leftSection={<LogIn size={18} />}
                  variant="gradient"
                  size="md"
                >
                  Sign Up
                </Button>
              </Stack>
            </form>
            <Button
              component="a"
              href="/login"
              leftSection={<UserPlus size={18} />}
              variant="gradient"
              size="md"
            >
              Login
            </Button>
            <Text size="sm" ta="center" c="dimmed">
              Forgot your password?{" "}
              <Anchor
                component={Link}
                href="/forgot-password"
                underline="hover"
              >
                Reset it here
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
