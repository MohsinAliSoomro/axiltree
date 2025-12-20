'use client'
import { Card, Grid, Stack, Text } from "@mantine/core";
import { Sparkles, Users, Zap } from "lucide-react";

export default function Why() {
  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Card
          shadow="sm"
          radius="lg"
          style={{ height: "100%", padding: "2rem" }}
        >
          <Stack gap="md">
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={24} color="white" />
            </div>
            <Text fw={600} size="lg">
              Easy Setup
            </Text>
            <Text c="dimmed" size="sm">
              5 minutes mein ready. Code ki zarurat nahi, sirf click karo aur
              live ho jao.
            </Text>
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Card
          shadow="sm"
          radius="lg"
          style={{ height: "100%", padding: "2rem" }}
        >
          <Stack gap="md">
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f093fb, #f5576c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={24} color="white" />
            </div>
            <Text fw={600} size="lg">
              Beautiful Design
            </Text>
            <Text c="dimmed" size="sm">
              Professional themes jo mobile par perfect dikhti hain. Customize
              bhi kar sakte ho.
            </Text>
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
        <Card
          shadow="sm"
          radius="lg"
          style={{ height: "100%", padding: "2rem" }}
        >
          <Stack gap="md">
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={24} color="white" />
            </div>
            <Text fw={600} size="lg">
              Track Analytics
            </Text>
            <Text c="dimmed" size="sm">
              Dekho kitne log click kar rahe hain. Apne best links ko identify
              karo.
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
