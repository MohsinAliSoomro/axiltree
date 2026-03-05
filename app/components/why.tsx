"use client";
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
              Links, Products & Blocks
            </Text>
            <Text c="dimmed" size="sm">
              Manage bio links, product cards, and rich content blocks from one simple dashboard.
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
              Smart Scheduling
            </Text>
            <Text c="dimmed" size="sm">
              Schedule publish and expiry windows for links, products, and campaigns automatically.
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
              Analytics & Growth
            </Text>
            <Text c="dimmed" size="sm">
              Track clicks by range and country, then optimize with templates and faster bulk updates.
            </Text>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
