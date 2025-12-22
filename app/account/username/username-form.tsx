"use client";

import { useFormState } from "react-dom";
import { TextInput, Button, Stack, Paper, Title, Text } from "@mantine/core";
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
      <Paper radius="lg" p="lg" maw={420} mx="auto" withBorder>
        <form action={formAction}>
          <Stack>
            <Title order={3}>Update Username</Title>
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
              value={username} // ✅ controlled
              onChange={(e) => setUsername(e.currentTarget.value)} // ✅ controlled
              required
            />

            <Button
              type="submit"
              leftSection={<Save size={16} />}
              variant="gradient"
            >
              Update Username
            </Button>
          </Stack>
        </form>
      </Paper>
    </AppShellLayout>
  );
}
