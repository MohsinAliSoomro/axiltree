"use client";

import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconShoppingBag, IconTrash } from "@tabler/icons-react";
import { formatScheduleDate } from "@/app/utils/linkSchedule";

type ProductItem = {
  id: string;
  title: string;
  buy_url: string;
  price?: number | null;
  is_active?: boolean;
  publish_at?: string | null;
  expire_at?: string | null;
};

interface ProductsListProps {
  products: ProductItem[];
  deleteProduct: (id: string) => void;
  updateProductLiveStatus: (id: string, isLive: boolean) => void;
  updateProductSchedule: (
    id: string,
    publishAt: string | null,
    expireAt: string | null
  ) => void;
}

const toLocalInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ProductsList({
  products,
  deleteProduct,
  updateProductLiveStatus,
  updateProductSchedule,
}: ProductsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [publishAtInput, setPublishAtInput] = useState("");
  const [expireAtInput, setExpireAtInput] = useState("");

  const editingProduct = useMemo(
    () => products.find((item) => item.id === editingId),
    [products, editingId]
  );

  const startEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setPublishAtInput(toLocalInputValue(product.publish_at));
    setExpireAtInput(toLocalInputValue(product.expire_at));
  };

  const closeEdit = () => {
    setEditingId(null);
    setPublishAtInput("");
    setExpireAtInput("");
  };

  const saveSchedule = () => {
    if (!editingId) return;

    const publishAtIso = publishAtInput ? new Date(publishAtInput).toISOString() : null;
    const expireAtIso = expireAtInput ? new Date(expireAtInput).toISOString() : null;

    if (publishAtIso && expireAtIso && new Date(expireAtIso) <= new Date(publishAtIso)) {
      alert("Expiry date must be after publish date.");
      return;
    }

    updateProductSchedule(editingId, publishAtIso, expireAtIso);
    closeEdit();
  };

  const getLiveBadge = (product: ProductItem) => {
    if (product?.is_active) {
      return { label: "Live", color: "green" };
    }

    return { label: "Draft", color: "gray" };
  };

  const getScheduleBadge = (product: ProductItem) => {
    if (!product?.is_active) return null;

    const now = new Date();
    const publishAt = product?.publish_at ? new Date(product.publish_at) : null;
    const expireAt = product?.expire_at ? new Date(product.expire_at) : null;

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
        <IconShoppingBag size={20} />
        <Text fw={600}>Products</Text>
        <Badge>{products.length}</Badge>
      </Group>

      <Box>
        <Stack gap="xs">
          {products.map((product) => {
            const liveBadge = getLiveBadge(product);
            const scheduleBadge = getScheduleBadge(product);
            const isEditing = editingId === product.id;

            return (
              <Card
                key={product.id}
                shadow="xs"
                p="sm"
              >
                <Group align="flex-start" wrap="nowrap">
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        {product.title}
                      </Text>
                      <Badge size="xs" variant="light" color={liveBadge.color}>
                        {liveBadge.label}
                      </Badge>
                      {scheduleBadge && (
                        <Badge size="xs" variant="light" color={scheduleBadge.color}>
                          {scheduleBadge.label}
                        </Badge>
                      )}
                    </Group>

                    <Text size="xs" c="dimmed" truncate>
                      {product.buy_url}
                    </Text>

                    {(product.publish_at || product.expire_at) && (
                      <Text size="xs" c="dimmed">
                        {product.publish_at
                          ? `Starts ${formatScheduleDate(product.publish_at)}`
                          : "Starts now"}
                        {product.expire_at
                          ? ` • Ends ${formatScheduleDate(product.expire_at)}`
                          : ""}
                      </Text>
                    )}

                    <Group gap={8} mt={4}>
                      <Switch
                        size="xs"
                        checked={Boolean(product.is_active)}
                        onChange={(event) =>
                          updateProductLiveStatus(
                            product.id,
                            event.currentTarget.checked
                          )
                        }
                        label={product?.is_active ? "Live" : "Draft"}
                      />

                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => {
                          if (isEditing) {
                            closeEdit();
                          } else {
                            startEdit(product);
                          }
                        }}
                      >
                        {isEditing ? "Close" : "Schedule"}
                      </Button>
                    </Group>

                    {isEditing && (
                      <Stack gap="xs" mt={4}>
                        <TextInput
                          label="Publish at"
                          type="datetime-local"
                          value={publishAtInput}
                          onChange={(event) => setPublishAtInput(event.currentTarget.value)}
                        />
                        <TextInput
                          label="Expire at (optional)"
                          type="datetime-local"
                          value={expireAtInput}
                          onChange={(event) => setExpireAtInput(event.currentTarget.value)}
                        />
                        <Group justify="flex-end" gap="xs">
                          <Button size="xs" variant="light" onClick={closeEdit}>
                            Cancel
                          </Button>
                          <Button size="xs" onClick={saveSchedule}>
                            Save
                          </Button>
                        </Group>
                      </Stack>
                    )}
                  </Stack>

                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            );
          })}
        </Stack>
      </Box>

      {editingProduct && (
        <Text size="xs" c="dimmed" mt="sm">
          Editing schedule for: {editingProduct.title}
        </Text>
      )}
    </Paper>
  );
}
