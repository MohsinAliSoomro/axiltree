import AppShellLayout from "@/app/components/layout";
import { countryMap } from "@/app/utils/countryColors";
import { PieChart } from "@mantine/charts";
import {
  Box,
  Card,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function Analytics({ data }: { data: any }) {
  const totalClicks = data.reduce((sum: any, item: any) => sum + item.count, 0);
  const colors = [
    "blue.6",
    "cyan.6",
    "teal.6",
    "green.6",
    "lime.6",
    "yellow.6",
    "orange.6",
    "red.6",
  ];

  const pieData = data.map((item: any, index: number) => ({
    name: item.country,
    value: item.count,
    color: colors[index % colors.length],
  }));

  return (
    <AppShellLayout>
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed" fw={500}>
              Total Clicks
            </Text>
            <Text size="xl" fw={700} mt="xs">
              {totalClicks.toLocaleString()}
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed" fw={500}>
              Countries
            </Text>
            <Text size="xl" fw={700} mt="xs">
              {data.length}
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed" fw={500}>
              Avg per Country
            </Text>
            <Text size="xl" fw={700} mt="xs">
              {Math.round(totalClicks / data.length)}
            </Text>
          </Card>
        </SimpleGrid>

        {/* Pie Chart */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={2} mb="md">
            Clicks by Country
          </Title>
          <Text size="sm" c="dimmed" mb="xl">
            Interactive distribution showing click percentages
          </Text>

          <PieChart
            h={400}
            data={pieData}
            withLabelsLine
            labelsPosition="outside"
            labelsType="percent"
            withLabels
            withTooltip
            tooltipDataSource="segment"
            mx="auto"
            size={280}
          />
        </Paper>

        {/* Country List with Percentages */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={3} mb="lg">
            Breakdown by Country
          </Title>
          <Stack gap="md">
            {data
              .sort((a: any, b: any) => b.count - a.count)
              .map((item: any, index: number) => {
                const percentage = ((item.count / totalClicks) * 100).toFixed(
                  1
                );
                //@ts-ignore
                const countryFlagColors = countryMap[item.country]?.flag
                  .colors || ["#000"];
                const gradientBackground =
                  countryFlagColors.length > 1
                    ? `linear-gradient(45deg, ${countryFlagColors.join(", ")})`
                    : countryFlagColors[0]; 
                return (
                  <Card
                    key={item.country}
                    shadow="xs"
                    padding="md"
                    radius="md"
                    withBorder
                    style={{
                      background: gradientBackground,
                      borderColor: countryFlagColors[0],
                      //@ts-ignore
                      color: countryMap[item.country]?.textColor,
                    }}
                  >
                    <Flex justify={"space-between"} align={"center"}>
                      <Text fw={600}>{item.country}</Text>
                      <Box>
                        <Text
                          size="xl"
                          fw={700}
                          style={{
                            color: countryFlagColors[0],
                          }}
                        >
                          {item.count}
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: countryFlagColors[0],
                          }}
                        >
                          clicks
                        </Text>
                        <Text
                          size="sm"
                          style={{
                            color: countryFlagColors[0],
                          }}
                        >
                          {percentage}% of total
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                );
              })}
          </Stack>
        </Paper>
      </Stack>
    </AppShellLayout>
  );
}
