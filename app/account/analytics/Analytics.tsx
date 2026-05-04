'use client'
import AppShellLayout from "@/app/components/layout";
import { countryMap } from "@/app/utils/countryColors";
import { PieChart, BarChart } from "@mantine/charts";
import {
  Box,
  Button,
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
  Group,
  SegmentedControl,
  TextInput,
  Container,
} from "@mantine/core";
import { IconLink, IconChevronDown } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AnalyticsRange = "1d" | "week" | "month" | "90d" | "custom";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toCsvValue(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export default function Analytics({ 
  analyticsData, 
  links,
  range,
  customStart,
  customEnd,
}: { 
  analyticsData: any[]; 
  links: any[];
  range: AnalyticsRange;
  customStart?: string;
  customEnd?: string;
}) {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<AnalyticsRange>(range);
  const [customStartDate, setCustomStartDate] = useState(customStart || "");
  const [customEndDate, setCustomEndDate] = useState(customEnd || "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSelectedRange(range);
    setCustomStartDate(customStart || "");
    setCustomEndDate(customEnd || "");
  }, [range, customStart, customEnd]);

  const applyRange = (
    nextRange: AnalyticsRange,
    start?: string,
    end?: string
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("range", nextRange);

    if (nextRange === "custom") {
      if (start) params.set("start", start);
      if (end) params.set("end", end);
    } else {
      params.delete("start");
      params.delete("end");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const customRangeValid =
    Boolean(customStartDate && customEndDate) &&
    new Date(customStartDate) <= new Date(customEndDate);

  const handleDownloadCsv = () => {
    const linkMap = new Map(
      (links || []).map((link: any) => [link.id, link])
    );

    const header = [
      "link_id",
      "link_title",
      "link_url",
      "country",
      "action",
      "created_at",
      "selected_range",
    ];

    const rows = (analyticsData || []).map((record: any) => {
      const link = linkMap.get(record.link_id);
      return [
        record.link_id,
        link?.title || "",
        link?.url || "",
        record.country || "Unknown",
        record.action || "click",
        record.created_at || "",
        selectedRange,
      ];
    });

    const csv = [
      header.map(toCsvValue).join(","),
      ...rows.map((row) => row.map(toCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const dateStamp = new Date().toISOString().slice(0, 10);
    const customSuffix =
      selectedRange === "custom" && customStartDate && customEndDate
        ? `-${customStartDate}-to-${customEndDate}`
        : "";
    const fileName = `analytics-${selectedRange}${customSuffix}-${dateStamp}.csv`;

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const { countryData, linksData, linkAnalytics } = useMemo(() => {
    const analytics: any = {};

    (analyticsData || []).forEach((record: any) => {
      if (!analytics[record.link_id]) {
        analytics[record.link_id] = {
          total: 0,
          byCountry: {},
        };
      }
      analytics[record.link_id].total += 1;

      const country = record.country || "Unknown";
      if (!analytics[record.link_id].byCountry[country]) {
        analytics[record.link_id].byCountry[country] = 0;
      }
      analytics[record.link_id].byCountry[country] += 1;
    });

    const enrichedLinks = (links || []).map((link: any) => ({
      ...link,
      clicks: analytics[link.id]?.total || 0,
      clicksByCountry: analytics[link.id]?.byCountry || {},
    }));

    const countryAggregate: any = {};
    Object.values(analytics).forEach((linkData: any) => {
      Object.entries(linkData.byCountry).forEach(([country, count]: [string, any]) => {
        if (!countryAggregate[country]) {
          countryAggregate[country] = 0;
        }
        countryAggregate[country] += count;
      });
    });

    const countries = Object.entries(countryAggregate).map(([country, count]) => ({
      country,
      count,
    }));

    return {
      countryData: countries,
      linksData: enrichedLinks,
      linkAnalytics: analytics,
    };
  }, [analyticsData, links]);

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
  return (
    <AppShellLayout>
      <Container size="xl" py={24}>
        <Stack gap={24}>
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
                  minHeight: 280,
                  background: "linear-gradient(180deg, #a20b28 0%, #bf0f37 52%, #a50c2d 100%)",
                  color: "white",
                  padding: "42px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 45% 25%, rgba(255,255,255,0.08), transparent 22%), radial-gradient(circle at 10% 15%, rgba(255,255,255,0.05), transparent 18%)",
                  }}
                />
                <Stack gap={14} style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
                  <Badge
                    radius="xl"
                    variant="filled"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.18)",
                      alignSelf: "flex-start",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                    }}
                  >
                    Analytics
                  </Badge>
                  <Title
                    order={1}
                    style={{
                      color: "white",
                      fontSize: "clamp(2.2rem, 4vw, 3.7rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.06em",
                    }}
                  >
                    Track what your audience actually clicks.
                  </Title>
                  <Text size="sm" c="rgba(255,255,255,0.88)" style={{ lineHeight: 1.7 }}>
                    Review performance by time range, export the raw data, and inspect link and country breakdowns from one place.
                  </Text>
                </Stack>

                <Group
                  gap={12}
                  mt={28}
                  style={{ position: "relative", zIndex: 1, flexWrap: "wrap" }}
                >
                  <Box
                    style={{
                      borderRadius: 18,
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      minWidth: 130,
                    }}
                  >
                    <Text size="xs" tt="uppercase" style={{ letterSpacing: "0.16em", opacity: 0.8 }}>
                      Total clicks
                    </Text>
                    <Text fw={700} size="xl">
                      {totalClicks.toLocaleString()}
                    </Text>
                  </Box>
                  <Box
                    style={{
                      borderRadius: 18,
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      minWidth: 130,
                    }}
                  >
                    <Text size="xs" tt="uppercase" style={{ letterSpacing: "0.16em", opacity: 0.8 }}>
                      Links
                    </Text>
                    <Text fw={700} size="xl">
                      {linksData?.length || 0}
                    </Text>
                  </Box>
                  <Box
                    style={{
                      borderRadius: 18,
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      minWidth: 160,
                    }}
                  >
                    <Text size="xs" tt="uppercase" style={{ letterSpacing: "0.16em", opacity: 0.8 }}>
                      Avg / link
                    </Text>
                    <Text fw={700} size="xl">
                      {linksData?.length > 0 ? Math.round(totalLinkClicks / linksData.length) : 0}
                    </Text>
                  </Box>
                </Group>
              </Box>

              <Box
                style={{
                  flex: "1 1 360px",
                  padding: 28,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Stack gap={16} style={{ width: "100%" }}>
                  <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
                    <Box>
                      <Title order={3} style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                        Analytics Overview
                      </Title>
                      <Text size="sm" c="#6b5156" mt={8}>
                        View performance by time range.
                      </Text>
                    </Box>
                    <Button
                      variant="light"
                      onClick={handleDownloadCsv}
                      radius="xl"
                      style={{ background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 }}
                    >
                      Download CSV
                    </Button>
                  </Group>

                  <SegmentedControl
                    value={selectedRange}
                    onChange={(value) => {
                      const nextRange = value as AnalyticsRange;
                      setSelectedRange(nextRange);

                      if (nextRange === "custom") {
                        const defaultEnd = customEndDate || toDateInputValue(new Date());
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        const defaultStart = customStartDate || toDateInputValue(sevenDaysAgo);

                        setCustomStartDate(defaultStart);
                        setCustomEndDate(defaultEnd);
                        applyRange("custom", defaultStart, defaultEnd);
                        return;
                      }

                      applyRange(nextRange);
                    }}
                    data={[
                      { label: "1D", value: "1d" },
                      { label: "7D", value: "week" },
                      { label: "30D", value: "month" },
                      { label: "90D", value: "90d" },
                      { label: "Custom", value: "custom" },
                    ]}
                  />

                  {selectedRange === "custom" && (
                    <Group mt="xs" align="end" gap="sm" wrap="wrap">
                      <TextInput
                        label="Start date"
                        type="date"
                        value={customStartDate}
                        onChange={(event) => setCustomStartDate(event.currentTarget.value)}
                      />
                      <TextInput
                        label="End date"
                        type="date"
                        value={customEndDate}
                        onChange={(event) => setCustomEndDate(event.currentTarget.value)}
                      />
                      <Button
                        onClick={() => applyRange("custom", customStartDate, customEndDate)}
                        disabled={!customRangeValid}
                        radius="xl"
                        style={{
                          background: "linear-gradient(90deg, #c51646 0%, #d62f5a 100%)",
                          fontWeight: 700,
                          boxShadow: "0 16px 30px rgba(197, 22, 70, 0.22)",
                        }}
                      >
                        Apply
                      </Button>
                    </Group>
                  )}
                </Stack>
              </Box>
            </Group>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={14}>
            <Card radius={20} p="lg" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 14px 40px rgba(43, 18, 26, 0.06)" }}>
              <Text size="xs" tt="uppercase" c="#8b7676" style={{ letterSpacing: "0.16em" }}>
                Total Clicks
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {totalClicks.toLocaleString()}
              </Text>
            </Card>
            <Card radius={20} p="lg" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 14px 40px rgba(43, 18, 26, 0.06)" }}>
              <Text size="xs" tt="uppercase" c="#8b7676" style={{ letterSpacing: "0.16em" }}>
                Links Count
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {linksData?.length || 0}
              </Text>
            </Card>
            <Card radius={20} p="lg" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 14px 40px rgba(43, 18, 26, 0.06)" }}>
              <Text size="xs" tt="uppercase" c="#8b7676" style={{ letterSpacing: "0.16em" }}>
                Avg Clicks per Link
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {linksData?.length > 0 ? Math.round(totalLinkClicks / linksData.length) : 0}
              </Text>
            </Card>
          </SimpleGrid>

          <Paper radius={28} p="xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 18px 50px rgba(43, 18, 26, 0.06)" }}>
            <Title order={2} mb="xs" style={{ letterSpacing: "-0.04em" }}>
              Clicks by Link
            </Title>
            <Text size="sm" c="#6b5156" mb="xl">
              Performance of each of your links.
            </Text>

            {barChartData.length > 0 ? (
              <BarChart
                h={400}
                data={barChartData}
                dataKey="link"
                series={[{ name: "clicks", label: "Clicks", color: "red.6" }]}
                tickLine="xy"
                yAxisProps={{ domain: [0, 'auto'] }}
              />
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No link data available yet
              </Text>
            )}
          </Paper>

          <Paper radius={28} p="xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 18px 50px rgba(43, 18, 26, 0.06)" }}>
            <Title order={3} mb="lg" style={{ letterSpacing: "-0.03em" }}>
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
                        radius={20}
                        p="md"
                        style={{
                          background: "#faf7f6",
                          border: "1px solid #ece4e1",
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

          {countryData && countryData.length > 0 && (
            <Paper radius={28} p="xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 18px 50px rgba(43, 18, 26, 0.06)" }}>
              <Title order={2} mb="xs" style={{ letterSpacing: "-0.04em" }}>
                Overall Clicks by Country
              </Title>
              <Text size="sm" c="#6b5156" mb="xl">
                Geographic distribution of all your clicks.
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

          {countryData && countryData.length > 0 && (
            <Paper radius={28} p="xl" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 18px 50px rgba(43, 18, 26, 0.06)" }}>
              <Title order={3} mb="lg" style={{ letterSpacing: "-0.03em" }}>
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
                        radius="md"
                        p="md"
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
      </Container>
    </AppShellLayout>
  );
}
