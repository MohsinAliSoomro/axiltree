"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Switch,
} from "@mantine/core";
import { IconGripVertical, IconStack2, IconTrash } from "@tabler/icons-react";
import { formatScheduleDate } from "@/app/utils/linkSchedule";

type ContentBlockItem = {
  id: string;
  type: "text" | "video" | "music" | "gallery";
  title?: string | null;
  is_active?: boolean;
  publish_at?: string | null;
  expire_at?: string | null;
  content_json?: {
    text?: string;
    url?: string;
    embedUrl?: string;
    images?: string[];
  };
};

interface ContentBlocksListProps {
  blocks: ContentBlockItem[];
  handleDragEnd: (result: any) => void;
  deleteBlock: (id: string) => void;
  updateBlockLiveStatus: (id: string, isLive: boolean) => void;
}

const typeColor = {
  text: "gray",
  video: "violet",
  music: "cyan",
  gallery: "orange",
} as const;

const getBlockSummary = (block: ContentBlockItem) => {
  if (block.type === "text") {
    return block.content_json?.text || "Text block";
  }

  if (block.type === "gallery") {
    const count = block.content_json?.images?.length || 0;
    return `${count} image${count === 1 ? "" : "s"}`;
  }

  return block.content_json?.url || "Embed URL";
};

export default function ContentBlocksList({
  blocks,
  handleDragEnd,
  deleteBlock,
  updateBlockLiveStatus,
}: ContentBlocksListProps) {
  const getLiveBadge = (block: ContentBlockItem) => {
    if (block?.is_active) {
      return { label: "Live", color: "green" };
    }

    return { label: "Draft", color: "gray" };
  };

  const getScheduleBadge = (block: ContentBlockItem) => {
    if (!block?.is_active) return null;

    const now = new Date();
    const publishAt = block?.publish_at ? new Date(block.publish_at) : null;
    const expireAt = block?.expire_at ? new Date(block.expire_at) : null;

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
        <IconStack2 size={20} />
        <Text fw={600}>Content Blocks</Text>
        <Badge>{blocks.length}</Badge>
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-blocks">
          {(provided) => (
            <Stack gap="xs" {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(dragProvided, snapshot) => {
                    const liveBadge = getLiveBadge(block);
                    const scheduleBadge = getScheduleBadge(block);

                    return (
                      <Card
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        shadow="xs"
                        p="sm"
                        style={{
                          ...dragProvided.draggableProps.style,
                          background: snapshot.isDragging ? "#f8f9fa" : "white",
                        }}
                      >
                        <Group wrap="nowrap" align="flex-start">
                          <div {...dragProvided.dragHandleProps}>
                            <IconGripVertical size={20} style={{ cursor: "grab" }} />
                          </div>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Group gap="xs">
                              <Text size="sm" fw={500}>
                                {block.title?.trim() || "Untitled Block"}
                              </Text>
                              <Badge size="xs" variant="light" color={typeColor[block.type]}>
                                {block.type}
                              </Badge>
                              <Badge size="xs" variant="light" color={liveBadge.color}>
                                {liveBadge.label}
                              </Badge>
                              {scheduleBadge && (
                                <Badge size="xs" variant="light" color={scheduleBadge.color}>
                                  {scheduleBadge.label}
                                </Badge>
                              )}
                            </Group>
                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {getBlockSummary(block)}
                            </Text>
                            {(block?.publish_at || block?.expire_at) && (
                              <Text size="xs" c="dimmed">
                                {block?.publish_at
                                  ? `Starts ${formatScheduleDate(block.publish_at)}`
                                  : "Starts now"}
                                {block?.expire_at
                                  ? ` • Ends ${formatScheduleDate(block.expire_at)}`
                                  : ""}
                              </Text>
                            )}
                            <Switch
                              size="xs"
                              checked={Boolean(block?.is_active)}
                              onChange={(event) =>
                                updateBlockLiveStatus(
                                  block.id,
                                  event.currentTarget.checked
                                )
                              }
                              label={block?.is_active ? "Live" : "Draft"}
                            />
                          </Stack>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => deleteBlock(block.id)}
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
