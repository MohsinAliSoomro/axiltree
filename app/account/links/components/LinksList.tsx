"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Paper, Stack, Group, Text, Badge, Card, ActionIcon } from "@mantine/core";
import { IconLink, IconGripVertical, IconTrash } from "@tabler/icons-react";

interface LinksListProps {
  links: any[];
  handleDragEnd: (result: any) => void;
  deleteLink: (id: any) => void;
}

export default function LinksList({ links, handleDragEnd, deleteLink }: LinksListProps) {
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
                  {(provided, snapshot) => (
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
                          <Text size="sm" fw={500}>
                            {link?.title}
                          </Text>
                          <Text size="xs" c="dimmed" truncate>
                            {link?.url}
                          </Text>
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
                  )}
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