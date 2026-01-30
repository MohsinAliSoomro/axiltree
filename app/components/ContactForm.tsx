"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Stack, Text } from "@mantine/core";
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
        <TextInput
          label="Name"
          name="name"
          placeholder="Your name"
          required
          size="md"
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          size="md"
        />
        <TextInput
          label="Subject"
          name="subject"
          placeholder="What is this about?"
          required
          size="md"
        />
        <Textarea
          label="Message"
          name="message"
          placeholder="Your message..."
          required
          minRows={4}
          size="md"
        />
        <Button
          type="submit"
          size="md"
          variant="gradient"
          loading={isSubmitting}
          fullWidth
        >
          Send Message
        </Button>
      </Stack>
    </form>
  );
}
