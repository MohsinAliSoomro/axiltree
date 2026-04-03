"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Stack, SimpleGrid } from "@mantine/core";
import { submitContactForm } from "../actions/contact";
import { notifications } from "@mantine/notifications";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.success) {
      notifications.show({
        title: "Success!",
        message: "Thank you for contacting us. We'll get back to you soon!",
        color: "green",
      });
      e.currentTarget.reset();
    } else {
      notifications.show({
        title: "Error",
        message: result.error || "Something went wrong. Please try again.",
        color: "red",
      });
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <TextInput
            label="Name"
            name="name"
            placeholder="John Doe"
            required
            size="sm"
            radius="md"
            styles={{
              input: { background: "#e9e9ea", border: "1px solid #dedede" },
              label: { color: "#6d6d6d", fontSize: "0.75rem" },
            }}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            size="sm"
            radius="md"
            styles={{
              input: { background: "#e9e9ea", border: "1px solid #dedede" },
              label: { color: "#6d6d6d", fontSize: "0.75rem" },
            }}
          />
        </SimpleGrid>

        <input type="hidden" name="subject" value="Landing page inquiry" />

        <Textarea
          label="Message"
          name="message"
          placeholder="How can we help you?"
          required
          minRows={3}
          size="sm"
          radius="md"
          styles={{
            input: { background: "#e9e9ea", border: "1px solid #dedede" },
            label: { color: "#6d6d6d", fontSize: "0.75rem" },
          }}
        />
        <Button
          type="submit"
          size="sm"
          radius="xl"
          loading={isSubmitting}
          fullWidth
          style={{ background: "#cf1048", fontWeight: 700 }}
        >
          Send Message
        </Button>
      </Stack>
    </form>
  );
}
