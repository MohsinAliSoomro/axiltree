'use client'
import AppShellLayout from "@/app/components/layout";
import { countryMap } from "@/app/utils/countryColors";
import { PieChart, BarChart } from "@mantine/charts";
import {
  Box,
  Card,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Badge,
  Collapse,
  ActionIcon,
} from "@mantine/core";
import { IconLink, IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

export default function Analytics({ 
  countryData, 
  linksData, 
  linkAnalytics 
}: { 
  countryData: any; 
  linksData: any;
  linkAnalytics: any;
}) {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  // Country Analytics
  const totalClicks = countryData?.reduce((sum: any, item: any) => sum + item.count, 0) || 0;
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

  const pieData = countryData?.map((item: any, index: number) => ({
    name: item.country,
    value: item.count,
    color: colors[index % colors.length],
  })) || [];

  // Link Analytics
  const totalLinkClicks = linksData?.reduce((sum: any, item: any) => sum + (item.clicks || 0), 0) || 0;
  
  const barChartData = linksData?.map((link: any) => ({
    link: link.title || "Untitled",
    clicks: link.clicks || 0,
  })) || [];

  const sortedLinks = [...(linksData || [])].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  console.log({barChartData, linksData})
  return (
    <AppShellLayout>
      <Stack gap="xl">
        {/* Key Metrics */}
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
              Links Count
            </Text>
            <Text size="xl" fw={700} mt="xs">
              {linksData?.length || 0}
            </Text>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed" fw={500}>
              Avg Clicks per Link
            </Text>
            <Text size="xl" fw={700} mt="xs">
              {linksData?.length > 0 ? Math.round(totalLinkClicks / linksData.length) : 0}
            </Text>
          </Card>
        </SimpleGrid>

        {/* Link Click Analytics with Bar Chart */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={2} mb="md">
            Clicks by Link
          </Title>
          <Text size="sm" c="dimmed" mb="xl">
            Performance of each of your links
          </Text>

          {barChartData.length > 0 ? (
            <BarChart
              h={400}
              data={barChartData}
              dataKey="link"
              series={[{ name: "clicks", label: "Clicks", color: "blue.6" }]}
              tickLine="xy"
              yAxisProps={{ domain: [0, 'auto'] }}
            />
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              No link data available yet
            </Text>
          )}
        </Paper>

        {/* Detailed Link Breakdown with Geographic Data */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={3} mb="lg">
            Link Performance & Geographic Breakdown
          </Title>
          <Stack gap="md">
            {sortedLinks && sortedLinks.length > 0 ? (
              sortedLinks.map((link: any) => {
                const percentage = totalLinkClicks > 0 
                  ? ((link.clicks / totalLinkClicks) * 100).toFixed(1) 
                  : "0";
                const isExpanded = expandedLink === link.id;
                const clicksByCountry = link.clicksByCountry || {};
                const countryList = Object.entries(clicksByCountry)
                  .map(([country, count]: [string, any]) => ({ country, count }))
                  .sort((a, b) => b.count - a.count);

                return (
                  <Stack key={link.id} gap="xs">
                    <Card
                      shadow="xs"
                      padding="md"
                      radius="md"
                      withBorder
                      style={{
                        background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                      }}
                    >
                      <Flex justify="space-between" align="center" gap="md">
                        <Flex gap="sm" align="flex-start" style={{ flex: 1 }}>
                          <Box pt={4}>
                            <IconLink size={20} />
                          </Box>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text fw={600} size="sm">
                              {link.title || "Untitled Link"}
                            </Text>
                            <Text size="xs" c="dimmed" truncate>
                              {link.url}
                            </Text>
                          </Stack>
                        </Flex>
                        <Flex align="center" gap="md">
                          <Box ta="right">
                            <Text size="lg" fw={700}>
                              {link.clicks || 0}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {percentage}% of total
                            </Text>
                          </Box>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => 
                              setExpandedLink(isExpanded ? null : link.id)
                            }
                          >
                            <IconChevronDown
                              size={20}
                              style={{
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s",
                              }}
                            />
                          </ActionIcon>
                        </Flex>
                      </Flex>
                    </Card>

                    {/* Geographic Breakdown for Each Link */}
                    <Collapse in={isExpanded}>
                      <Paper p="md" radius="md" bg="gray.0" withBorder>
                        <Stack gap="sm">
                          <Text size="sm" fw={600} c="dimmed">
                            Clicks by Country
                          </Text>
                          {countryList.length > 0 ? (
                            countryList.map(({ country, count }: { country: string; count: number }) => {
                              const countryPercentage = link.clicks > 0
                                ? ((count / link.clicks) * 100).toFixed(1)
                                : "0";
                              //@ts-ignore
                              const countryFlagColors = countryMap[country]?.flag?.colors || ["#999"];
                              const gradientBg = countryFlagColors.length > 1
                                ? `linear-gradient(90deg, ${countryFlagColors.join(", ")})`
                                : countryFlagColors[0];

                              return (
                                <Flex
                                  key={country}
                                  justify="space-between"
                                  align="center"
                                  p="sm"
                                  style={{
                                    background: gradientBg,
                                    opacity: 0.8,
                                  }}
                                >
                                  <Text
                                    size="sm"
                                    fw={500}
                                    c="white"
                                  >
                                    {country}
                                  </Text>
                                  <Flex gap="lg" align="center">
                                    <Text
                                      size="sm"
                                      fw={700}
                                      c="white"
                                    >
                                      {count}
                                    </Text>
                                    <Badge
                                      size="lg"
                                      variant="light"
                                      c="white"
                                    >
                                      {countryPercentage}%
                                    </Badge>
                                  </Flex>
                                </Flex>
                              );
                            })
                          ) : (
                            <Text size="sm" c="dimmed">
                              No geographic data yet
                            </Text>
                          )}
                        </Stack>
                      </Paper>
                    </Collapse>
                  </Stack>
                );
              })
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No links available
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Pie Chart for Country Distribution */}
        {countryData && countryData.length > 0 && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={2} mb="md">
              Overall Clicks by Country
            </Title>
            <Text size="sm" c="dimmed" mb="xl">
              Geographic distribution of all your clicks
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
        )}

        {/* Country Breakdown Summary */}
        {countryData && countryData.length > 0 && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={3} mb="lg">
              Overall Breakdown by Country
            </Title>
            <Stack gap="md">
              {countryData
                .sort((a: any, b: any) => b.count - a.count)
                .map((item: any) => {
                  const percentage = ((item.count / totalClicks) * 100).toFixed(1);
                  //@ts-ignore
                  const countryFlagColors = countryMap[item.country]?.flag?.colors || ["#999"];
                  const gradientBackground = countryFlagColors.length > 1
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
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fw={600} c="white">
                          {item.country}
                        </Text>
                        <Flex gap="md" align="center">
                          <Text size="lg" fw={700} c="white">
                            {item.count}
                          </Text>
                          <Badge size="lg" variant="light" c="white">
                            {percentage}%
                          </Badge>
                        </Flex>
                      </Flex>
                    </Card>
                  );
                })}
            </Stack>
          </Paper>
        )}
      </Stack>
    </AppShellLayout>
  );
}
