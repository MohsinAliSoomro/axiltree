"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Card,
  ActionIcon,
  Switch,
} from "@mantine/core";
import { IconLink, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { formatScheduleDate } from "@/app/utils/linkSchedule";

interface LinksListProps {
  links: any[];
  handleDragEnd: (result: any) => void;
  deleteLink: (id: any) => void;
  updateLinkLiveStatus: (id: string, isLive: boolean) => void;
}

export default function LinksList({
  links,
  handleDragEnd,
  deleteLink,
  updateLinkLiveStatus,
}: LinksListProps) {
  const getStatusBadge = (link: any) => {
    if (link?.is_active) {
      return {
        label: "Live",
        color: "green",
      };
    }

    return {
      label: "Draft",
      color: "gray",
    };
  };

  const getScheduleBadge = (link: any) => {
    if (!link?.is_active) return null;

    const now = new Date();
    const publishAt = link?.publish_at ? new Date(link.publish_at) : null;
    const expireAt = link?.expire_at ? new Date(link.expire_at) : null;

    if (publishAt && publishAt > now) {
      return { label: "Scheduled", color: "blue" };
    }

    if (expireAt && expireAt <= now) {
      return { label: "Expired", color: "red" };
    }

    if (publishAt || expireAt) {
      return { label: "Active", color: "teal" };
    }

    return null;
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconLink size={20} />
        <Text fw={600}>Your Links</Text>
        <Badge>{links.length}</Badge>
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <Stack
              gap="xs"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {links.map((link: any, index: number) => (
                <Draggable
                  key={link.id}
                  draggableId={link.id}
                  index={index}
                >
                  {(provided, snapshot) => {
                    const primaryBadge = getStatusBadge(link);
                    const scheduleBadge = getScheduleBadge(link);

                    return (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        shadow="xs"
                        p="sm"
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging
                            ? "#f8f9fa"
                            : "white",
                        }}
                      >
                        <Group wrap="nowrap">
                          <div {...provided.dragHandleProps}>
                            <IconGripVertical
                              size={20}
                              style={{ cursor: "grab" }}
                            />
                          </div>
                          <Stack gap={0} style={{ flex: 1 }}>
                            <Group gap="xs" wrap="nowrap">
                              <Text size="sm" fw={500}>
                                {link?.title}
                              </Text>
                              <Badge
                                size="xs"
                                color={primaryBadge.color}
                                variant="light"
                              >
                                {primaryBadge.label}
                              </Badge>
                              {scheduleBadge && (
                                <Badge
                                  size="xs"
                                  color={scheduleBadge.color}
                                  variant="light"
                                >
                                  {scheduleBadge.label}
                                </Badge>
                              )}
                            </Group>
                            <Text size="xs" c="dimmed" truncate>
                              {link?.url}
                            </Text>
                            {(link?.publish_at || link?.expire_at) && (
                              <Text size="xs" c="dimmed">
                                {link?.publish_at
                                  ? `Starts ${formatScheduleDate(link.publish_at)}`
                                  : "Starts now"}
                                {link?.expire_at
                                  ? ` • Ends ${formatScheduleDate(link.expire_at)}`
                                  : ""}
                              </Text>
                            )}
                            <Group gap={6} mt={4}>
                              <Switch
                                size="xs"
                                checked={Boolean(link?.is_active)}
                                onChange={(event) =>
                                  updateLinkLiveStatus(
                                    link.id,
                                    event.currentTarget.checked
                                  )
                                }
                                label={link?.is_active ? "Live" : "Draft"}
                              />
                            </Group>
                          </Stack>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => deleteLink(link?.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Card>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
}