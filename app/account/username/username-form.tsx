"use client";

import { useFormState } from "react-dom";
import { TextInput, Button, Stack, Paper, Title, Text, Box, Group, Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Save, Check, X, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { updateUsernameAction } from "./actions";
import AppShellLayout from "@/app/components/layout";

const initialState = {
  status: "",
  message: "",
};

export default function UsernameForm({
  user,
  currentUsername,
}: {
  user: any;
  currentUsername: string;
}) {
  const [username, setUsername] = useState(currentUsername);
  const [state, formAction] = useFormState(updateUsernameAction, initialState);
  console.log("Form state:", state);
  useEffect(() => {
    if (!state.message) return;

    notifications.show({
      title:
        state.status === "success"
          ? "Success"
          : state.status === "info"
          ? "Username Taken"
          : "Error",
      message: state.message,
      color:
        state.status === "success"
          ? "green"
          : state.status === "info"
          ? "yellow"
          : "red",
      icon:
        state.status === "success" ? (
          <Check size={16} />
        ) : state.status === "info" ? (
          <Info size={16} />
        ) : (
          <X size={16} />
        ),
    });

    // ✅ If success, update the input to reflect new username
    if (state.status === "success") {
      setUsername(state.message.includes("updated") ? username : username);
    }
  }, [state]);

  return (
    <AppShellLayout>
      <Container size="lg" >
        <Paper
          radius={32}
          p={0}
          style={{
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 22px 55px rgba(43, 18, 26, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          <Group align="stretch" gap={0} wrap="wrap">
            <Box
              style={{
                flex: "1 1 420px",
                minHeight: 560,
                background: "linear-gradient(180deg, #a20b28 0%, #bf0f37 52%, #a50c2d 100%)",
                color: "white",
                padding: "56px 42px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 10% 15%, rgba(255,255,255,0.05), transparent 18%)",
                }}
              />

              <Box style={{ position: "relative", zIndex: 1, maxWidth: 320 }}>
                <Text fw={700} size="xs" tt="uppercase" style={{ letterSpacing: "0.35em", opacity: 0.92 }}>
                  The digital curator
                </Text>

                <Box
                  style={{
                    position: "absolute",
                    top: -120,
                    left: 42,
                    fontSize: 180,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "rgba(255, 255, 255, 0.08)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  C1
                </Box>

                <Title order={1} style={{ color: "white", fontSize: "clamp(2.4rem, 4vw, 4rem)", lineHeight: 0.96, letterSpacing: "-0.06em", maxWidth: 280, marginTop: 18 }}>
                  Claim your handle.
                </Title>

                <Text mt={20} size="md" c="rgba(255,255,255,0.9)" style={{ lineHeight: 1.7, maxWidth: 290 }}>
                  Keep your public username aligned with your brand across AxilTree.
                </Text>
              </Box>
            </Box>

            <Box
              style={{
                flex: "1 1 360px",
                minHeight: 560,
                background: "#fff",
                padding: "58px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack gap={20} maw={430} mx="auto" w="100%">
                <Box>
                  <Title order={2} style={{ fontSize: "clamp(2rem, 3vw, 2.55rem)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                    Update username
                  </Title>
                  <Text c="#6b5156" size="sm" mt={8}>
                    Set a clean handle for your public profile.
                  </Text>
                </Box>

                <form action={formAction}>
                  <Stack gap={14}>
                    {state.message && (
                      <Text
                        c={
                          state.status === "success"
                            ? "green"
                            : state.status === "info"
                            ? "yellow"
                            : "red"
                        }
                      >
                        {state?.message}
                      </Text>
                    )}
                    <input type="hidden" name="userId" value={user.id} />

                    <TextInput
                      label="Username"
                      name="username"
                      placeholder="your-username"
                      value={username}
                      onChange={(e) => setUsername(e.currentTarget.value)}
                      required
                    />

                    <Button
                      type="submit"
                      leftSection={<Save size={16} />}
                      radius="xl"
                      size="md"
                      style={{
                        background: "linear-gradient(90deg, #c51646 0%, #d62f5a 100%)",
                        fontWeight: 700,
                        height: 40,
                        boxShadow: "0 16px 30px rgba(197, 22, 70, 0.22)",
                      }}
                    >
                      Update Username
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Group>
        </Paper>
      </Container>
    </AppShellLayout>
  );
}
